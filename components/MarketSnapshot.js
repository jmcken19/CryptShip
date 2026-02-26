'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function formatPrice(price) {
    if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '$' + price.toFixed(2);
}

function formatChange(val) {
    if (val == null) return '—';
    const prefix = val >= 0 ? '+' : '';
    return prefix + val.toFixed(2) + '%';
}

export default function MarketSnapshot() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    async function fetchData() {
        try {
            const res = await fetch('/api/market-snapshot');
            const json = await res.json();

            if (!res.ok || json.ok === false) {
                console.error('Market fetch error:', json.error);
                setErrorMsg('Market data temporarily unavailable.');
                // Do not clear existing 'data' here to satisfy: "keep last known values if available"
                return;
            }

            setErrorMsg('');
            setData(json);
        } catch (e) {
            console.error('Market fetch request failed:', e);
            setErrorMsg('Market data temporarily unavailable.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const tiles = [
        { key: 'btc', symbol: 'BTC', name: 'Bitcoin', route: '/btc' },
        { key: 'eth', symbol: 'ETH', name: 'Ethereum', route: '/eth' },
        { key: 'sol', symbol: 'SOL', name: 'Solana', route: '/sol' },
    ];

    return (
        <section className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <span className="icon">◈</span> Market Snapshot
                </h2>
                {errorMsg && !data && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--coral-400)' }}>
                        {errorMsg}
                    </span>
                )}
            </div>

            {errorMsg && data && (
                <div style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--coral-400)' }}>
                    Failed to update accurately. Showing last known values.
                </div>
            )}

            <div className="market-grid" style={{ marginTop: '1.5rem' }}>
                {tiles.map((tile) => {
                    const d = data?.[tile.key];
                    return (
                        <div
                            key={tile.key}
                            className={`card card-clickable market-tile ${tile.key}`}
                            onClick={() => router.push(tile.route)}
                            role="link"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && router.push(tile.route)}
                        >
                            <div className="market-tile-header">
                                <span className="market-tile-symbol">{tile.symbol}</span>
                                <span className="market-tile-name">{tile.name}</span>
                            </div>
                            {loading && !data ? (
                                <div className="loading-shimmer skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
                            ) : (
                                <>
                                    <div className="market-tile-price">
                                        {d ? formatPrice(d.price) : '—'}
                                    </div>
                                    <div className="market-tile-changes">
                                        <span>
                                            <span className="market-change-label">24h</span>
                                            <span className={`market-change ${d?.change24h >= 0 ? 'change-positive' : 'change-negative'}`}>
                                                {d ? formatChange(d.change24h) : '—'}
                                            </span>
                                        </span>
                                        <span>
                                            <span className="market-change-label">7d</span>
                                            <span className={`market-change ${d?.change7d >= 0 ? 'change-positive' : 'change-negative'}`}>
                                                {d ? formatChange(d.change7d) : '—'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="market-tile-updated">
                                        Last updated: {d ? new Date(d.lastUpdated).toLocaleTimeString() : '—'}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
