import { NextResponse } from 'next/server';

const chartCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const coinMap = {
    sol: 'solana',
    eth: 'ethereum',
    btc: 'bitcoin',
};

function generateFallbackData(days) {
    const points = days <= 1 ? 24 : days <= 7 ? 7 * 24 : days <= 30 ? 30 : 365;
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
    const days = parseInt(searchParams.get('days') || '7', 10);

    const cacheKey = `${coin}-${days}`;
    const cached = chartCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return NextResponse.json(cached.data);
    }

    try {
        const coingeckoId = coinMap[coin] || coin;
        const baseUrl = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';
        const res = await fetch(
            `${baseUrl}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 300 },
            }
        );

        if (!res.ok) {
            const fallback = { prices: generateFallbackData(days) };
            return NextResponse.json(fallback);
        }

        const data = await res.json();
        chartCache.set(cacheKey, { data, timestamp: Date.now() });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Chart data fetch error:', error.message);
        const fallback = { prices: generateFallbackData(days) };
        return NextResponse.json(fallback);
    }
}
