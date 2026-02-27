import { NextResponse } from 'next/server';

const chartCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const coinMap = {
    sol: 'solana',
    eth: 'ethereum',
    btc: 'bitcoin',
};

function generateFallbackData(period) {
    let days = 1;
    let points = 24;

    if (period === '1h') {
        days = 1 / 24;
        points = 12;
    } else if (period === '6h') {
        days = 6 / 24;
        points = 72;
    } else if (period === '24h') {
        days = 1;
        points = 288;
    } else if (period === '7d') {
        days = 7;
        points = 168;
    }

    const data = [];
    const now = Date.now();
    const interval = (days * 24 * 60 * 60 * 1000) / points;
    let price = 100 + Math.random() * 50;

    for (let i = 0; i < points; i++) {
        price += (Math.random() - 0.48) * 3;
        price = Math.max(price * 0.95, price);
        data.push([now - (points - i) * interval, price]);
    }
    return data;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin') || 'btc';
    const period = searchParams.get('period') || '6h';

    let daysToFetch = 1;
    if (period === '7d') daysToFetch = 7;

    const cacheKey = `${coin}-${period}`;
    const cached = chartCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return NextResponse.json(cached.data);
    }

    try {
        const coingeckoId = coinMap[coin] || coin;
        const baseUrl = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';
        const res = await fetch(
            `${baseUrl}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${daysToFetch}`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 300 },
            }
        );

        if (!res.ok) {
            const fallback = { prices: generateFallbackData(period) };
            return NextResponse.json(fallback);
        }

        const data = await res.json();

        let prices = data.prices;
        if (prices) {
            const now = Date.now();
            if (period === '1h') {
                const cutoff = now - 60 * 60 * 1000;
                prices = prices.filter(p => p[0] >= cutoff);
            } else if (period === '6h') {
                const cutoff = now - 6 * 60 * 60 * 1000;
                prices = prices.filter(p => p[0] >= cutoff);
            }
            data.prices = prices;
        }

        chartCache.set(cacheKey, { data, timestamp: Date.now() });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Chart data fetch error:', error.message);
        const fallback = { prices: generateFallbackData(period) };
        return NextResponse.json(fallback);
    }
}
