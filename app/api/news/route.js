import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const parser = new Parser({
    customFields: {
        item: ['published', 'pubDate'],
    }
});

const newsCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const SCOPE_CURRENCIES = {
    global: '',
    btc: 'BTC',
    eth: 'ETH',
    sol: 'SOL',
};

// RSS feed URLs
const FEEDS = {
    global: [
        'https://www.coindesk.com/arc/outboundfeeds/rss/',
        'https://cointelegraph.com/rss'
    ],
    btc: [
        'https://cointelegraph.com/rss/tag/bitcoin',
        'https://www.coindesk.com/arc/outboundfeeds/rss/?category=bitcoin'
    ],
    eth: [
        'https://cointelegraph.com/rss/tag/ethereum',
        'https://www.coindesk.com/arc/outboundfeeds/rss/?category=ethereum'
    ],
    sol: [
        'https://cointelegraph.com/rss/tag/solana',
        'https://www.coindesk.com/arc/outboundfeeds/rss/?category=solana'
    ]
};

function determineSource(link) {
    if (!link) return 'Crypto News';
    if (link.includes('coindesk')) return 'CoinDesk';
    if (link.includes('cointelegraph')) return 'Cointelegraph';
    return new URL(link).hostname.replace('www.', '');
}

function parseDate(item) {
    const rawArgs = item.pubDate || item.isoDate || item.published;
    if (!rawArgs) return new Date();
    const d = new Date(rawArgs);
    return isNaN(d) ? new Date() : d;
}

function formatTimeAgo(dateObj) {
    const diffHours = (Date.now() - dateObj.getTime()) / (1000 * 60 * 60);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 2) return '1 hour ago';
    return `${Math.floor(diffHours)} hours ago`;
}

async function fetchFeeds(urls) {
    let allItems = [];

    // Fetch all feeds in parallel with strict 4s timeout
    const fetchPromises = urls.map(async (url) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        try {
            const feedUrl = url;
            const res = await fetch(feedUrl, { signal: controller.signal, cache: 'no-store' });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const text = await res.text();

            // Pass string directly to parser to avoid it making its own fetching without timeout
            const parsed = await parser.parseString(text);
            return parsed.items.map(item => ({
                title: item.title,
                url: item.link,
                source: determineSource(item.link || feedUrl),
                publishedAt: parseDate(item)
            }));
        } catch (e) {
            console.error(`[DEBUG news] Failed fetching RSS: ${url} ->`, e.message);
            return [];
        } finally {
            clearTimeout(timeout);
        }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(items => { allItems = allItems.concat(items); });

    // Dedupe by URL
    const uniqueMap = new Map();
    allItems.forEach(item => {
        if (item.url && !uniqueMap.has(item.url)) {
            uniqueMap.set(item.url, item);
        } else if (!item.url && !uniqueMap.has(item.title)) {
            uniqueMap.set(item.title, item);
        }
    });

    // Sort by Date DESC and slice top 7
    return Array.from(uniqueMap.values())
        .sort((a, b) => b.publishedAt - a.publishedAt)
        .slice(0, 7)
        .map((item, index) => ({
            id: `rss-${index}-${Date.now()}`,
            title: item.title,
            url: item.url,
            source: item.source,
            publishedAt: item.publishedAt.toISOString(),
            timestamp: formatTimeAgo(item.publishedAt)
        }));
}

function generateBullets(headlines) {
    return headlines.slice(0, 3).map(h => h.title + '.');
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'global';

    if (!SCOPE_CURRENCIES.hasOwnProperty(scope)) {
        return NextResponse.json({ error: 'Invalid scope. Use: global, btc, eth, sol' }, { status: 400 });
    }

    // Check cache
    const cacheKey = scope;
    const cached = newsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return NextResponse.json(cached.data);
    }

    const targetUrls = FEEDS[scope] || FEEDS.global;
    const headlines = await fetchFeeds(targetUrls);

    // Fallback if APIs completely fail: Avoid crashing completely by returning empty arrays
    // A more resilient UI will just show "No news available"
    const bullets = scope === 'global' ? generateBullets(headlines) : undefined;

    const result = {
        scope,
        headlines,
        ...(bullets && { bullets }),
        provider: 'RSS Aggregator (CoinDesk/Cointelegraph)',
        lastFetched: new Date().toISOString(),
    };

    newsCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
}
