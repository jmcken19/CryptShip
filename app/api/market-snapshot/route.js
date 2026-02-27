import { NextResponse } from 'next/server';

let cache = {
    data: null,
    timestamp: 0,
};

let lastErrorTime = 0;
const ERROR_CACHE_DURATION = 10 * 1000;      // 10 seconds
const CACHE_DURATION = 60 * 1000;           // 60 seconds

// Fetch Coinbase Spot Prices
async function fetchCoinbasePrices() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    try {
        const [btc, eth, sol] = await Promise.all([
            fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', { signal: controller.signal, cache: 'no-store' }).then(r => r.json()),
            fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot', { signal: controller.signal, cache: 'no-store' }).then(r => r.json()),
            fetch('https://api.coinbase.com/v2/prices/SOL-USD/spot', { signal: controller.signal, cache: 'no-store' }).then(r => r.json()),
        ]);

        if (!btc?.data?.amount || !eth?.data?.amount || !sol?.data?.amount) {
            throw new Error('Invalid response from Coinbase API');
        }

        const nowIso = new Date().toISOString();

        return {
            btc: { price: Number(btc.data.amount), change24h: null, change7d: null, volume24h: null, lastUpdated: nowIso, mempoolLevel: 'Normal' },
            eth: { price: Number(eth.data.amount), change24h: null, change7d: null, volume24h: null, lastUpdated: nowIso, gasIndicator: 'Medium' },
            sol: { price: Number(sol.data.amount), change24h: null, change7d: null, volume24h: null, lastUpdated: nowIso, activity: 'High' }
        };
    } finally {
        clearTimeout(timeout);
    }
}

// Fetch CoinGecko Detailed Prices (fallback)
async function fetchCoinGeckoPrices() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
        const baseUrl = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';
        const apiKey = process.env.COINGECKO_API_KEY || process.env.MARKET_DATA_API_KEY || '';
        const headers = { 'Accept': 'application/json' };

        if (apiKey) {
            headers['x-cg-demo-api-key'] = apiKey;
        }

        const res = await fetch(
            `${baseUrl}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h,7d`,
            { headers, cache: 'no-store', signal: controller.signal }
        );

        if (!res.ok) {
            throw new Error(`CoinGecko API returned ${res.status}`);
        }

        const coins = await res.json();
        if (!Array.isArray(coins) || coins.length === 0) {
            throw new Error('Invalid data from CoinGecko');
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

        if (result.sol) { result.sol.activity = 'High'; result.sol.feeLevel = 'Low'; }
        if (result.eth) { result.eth.gasIndicator = 'Medium'; result.eth.baseFee = 'Moderate'; }
        if (result.btc) { result.btc.mempoolLevel = 'Normal'; }

        return result;
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchMarketData() {
    const now = Date.now();

    // 1. Check valid cache
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
        console.log('[DEBUG market-snapshot] Serving from cache (Provider:', cache.data.providerUsed, ') - Age:', Math.round((now - cache.timestamp) / 1000), 's');
        return cache.data;
    }

    // 2. Prevent hammering if we repeatedly fail
    if (now - lastErrorTime < ERROR_CACHE_DURATION && !cache.data) {
        throw new Error('APIs temporarily down. Try again later.');
    }

    // 3. Try Primary (Coinbase) for precise spot prices
    let prices = null;
    let fallbackPrices = null;

    try {
        const coinbasePromise = fetchCoinbasePrices();
        // Option 2: concurrently fetch CoinGecko for volume/change data 
        const cgPromise = fetchCoinGeckoPrices().catch(e => null);

        const [cbData, cgData] = await Promise.all([coinbasePromise, cgPromise]);
        prices = cbData;

        // Merge CoinGecko supplemental data if available safely
        if (cgData) {
            for (const key of ['btc', 'eth', 'sol']) {
                if (prices[key] && cgData[key]) {
                    prices[key].change24h = (cgData[key].change24h != null) ? Number(cgData[key].change24h) : null;
                    prices[key].change7d = (cgData[key].change7d != null) ? Number(cgData[key].change7d) : null;
                    prices[key].volume24h = (cgData[key].volume24h != null) ? Number(cgData[key].volume24h) : null;
                    prices[key].marketCap = (cgData[key].marketCap != null) ? Number(cgData[key].marketCap) : null;
                }
            }
        }

        prices.providerUsed = 'coinbase' + (cgData ? ' + coingecko' : '');
        console.log(`[DEBUG market-snapshot] Primary fetch success (${prices.providerUsed}) at`, new Date().toISOString());

        cache.data = prices;
        cache.timestamp = now;
        return prices;
    } catch (primaryErr) {
        console.error('[DEBUG market-snapshot] Primary provider (Coinbase) failed:', primaryErr.message);

        // 4. Try Fallback completely (CoinGecko standalone)
        try {
            fallbackPrices = await fetchCoinGeckoPrices();

            // Normalize mapping explicitly
            for (const key of ['btc', 'eth', 'sol']) {
                if (fallbackPrices[key]) {
                    fallbackPrices[key].change24h = fallbackPrices[key].change24h != null ? Number(fallbackPrices[key].change24h) : null;
                    fallbackPrices[key].change7d = fallbackPrices[key].change7d != null ? Number(fallbackPrices[key].change7d) : null;
                    fallbackPrices[key].volume24h = fallbackPrices[key].volume24h != null ? Number(fallbackPrices[key].volume24h) : null;
                }
            }

            fallbackPrices.providerUsed = 'coingecko';
            console.log('[DEBUG market-snapshot] Fallback standalone fetch success (CoinGecko) at', new Date().toISOString());

            cache.data = fallbackPrices;
            cache.timestamp = now;
            return fallbackPrices;
        } catch (fallbackErr) {
            lastErrorTime = Date.now();
            console.error('[DEBUG market-snapshot] Fallback provider (CoinGecko) failed:', fallbackErr.message);

            // 5. Serve stale cache if available
            if (cache.data) {
                console.log('[DEBUG market-snapshot] Both providers failed. Serving stale cached data.');
                return cache.data;
            }
            throw new Error('All market data providers failed');
        }
    }
}

export async function GET() {
    try {
        const snapshot = await fetchMarketData();
        return NextResponse.json({ ok: true, ...snapshot });
    } catch (error) {
        return NextResponse.json({
            ok: false,
            error: error.message || 'Failed to fetch market data',
            lastUpdated: null
        }, { status: 503 });
    }
}
