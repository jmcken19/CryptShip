import { NextResponse } from 'next/server';

let cache = {
    data: null,
    timestamp: 0,
};

// Also track when we last failed, to avoid hammering API if it's down
let lastErrorTime = 0;
const ERROR_CACHE_DURATION = 10 * 1000; // 10 seconds

const CACHE_DURATION = 60 * 1000; // 60 seconds

async function fetchMarketData() {
    const now = Date.now();

    if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
        console.log('[DEBUG market-snapshot] Serving from cache, age:', Math.round((now - cache.timestamp) / 1000), 's');
        return cache.data;
    }

    if (now - lastErrorTime < ERROR_CACHE_DURATION && !cache.data) {
        throw new Error('API is temporarily down. Try again later.');
    }

    try {
        const baseUrl = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

        // Use /coins/markets for accurate 24h and 7d change data
        const res = await fetch(
            `${baseUrl}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h,7d`,
            {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            console.error('[DEBUG market-snapshot] CoinGecko API error:', res.status, res.statusText);
            throw new Error(`API returned ${res.status}`);
        }

        const coins = await res.json();
        console.log('[DEBUG market-snapshot] Fresh fetch from CoinGecko /coins/markets at', new Date().toISOString());

        // Validate basic structure
        if (!Array.isArray(coins) || coins.length === 0) {
            throw new Error('Invalid data received from API');
        }

        const result = {};
        const idToKey = { bitcoin: 'btc', ethereum: 'eth', solana: 'sol' };

        for (const coin of coins) {
            const key = idToKey[coin.id];
            if (!key) continue;

            result[key] = {
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0,
                change7d: coin.price_change_percentage_7d_in_currency ?? 0,
                volume24h: coin.total_volume,
                marketCap: coin.market_cap,
                lastUpdated: coin.last_updated || new Date().toISOString(),
            };
        }

        // Add chain-specific simulated metrics for MVP
        if (result.sol) {
            result.sol.feeLevel = 'Low';
            result.sol.feeLevelValue = '~0.000005 SOL';
            result.sol.activity = 'High';
        }
        if (result.eth) {
            result.eth.gasIndicator = 'Medium';
            result.eth.gasValue = '~25 gwei';
            result.eth.baseFee = 'Moderate';
        }
        if (result.btc) {
            result.btc.feeRate = 'Low';
            result.btc.feeRateValue = '~8 sat/vB';
            result.btc.mempoolLevel = 'Normal';
        }

        cache.data = result;
        cache.timestamp = now;
        return result;
    } catch (error) {
        lastErrorTime = Date.now();
        console.error('[DEBUG market-snapshot] Fetch error:', error.message);
        // If we have stale cache, serve it silently instead of failing hard.
        if (cache.data) {
            console.log('[DEBUG market-snapshot] Serving stale cached data due to error.');
            return cache.data;
        }
        throw error;
    }
}

export async function GET() {
    try {
        const snapshot = await fetchMarketData();
        return NextResponse.json(snapshot);
    } catch (error) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Failed to fetch market data',
            lastUpdated: null
        }, { status: 503 });
    }
}
