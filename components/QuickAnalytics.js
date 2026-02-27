'use client';

import { useState, useEffect } from 'react';

function formatPrice(price) {
    if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '$' + price.toFixed(2);
}

function formatVolume(vol) {
    if (vol == null || vol === '') return '—';
    const num = Number(vol);
    if (!Number.isFinite(num)) return '—';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(1) + 'M';
    return '$' + num.toLocaleString();
}

function formatChange(val) {
    if (val == null || val === '') return '—';
    const num = Number(val);
    if (!Number.isFinite(num)) return '—';
    const prefix = num >= 0 ? '+' : '';
    return prefix + num.toFixed(2) + '%';
}

export default function QuickAnalytics({ chainId, chainConfig, isMini = false, isHorizontal = false }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch_data() {
            try {
                const res = await fetch('/api/market-snapshot');
                if (res.ok) {
                    const json = await res.json();
                    setData(json[chainId]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetch_data();
        const interval = setInterval(fetch_data, 60000);
        return () => clearInterval(interval);
    }, [chainId]);

    if (loading) {
        const skeletonCount = isHorizontal ? 4 : (isMini ? 3 : 6);
        return (
            <div className={isMini || isHorizontal ? "" : "section"}>
                {(!isMini && !isHorizontal) && <h2 className="section-title">Quick Analytics</h2>}
                <div className={isHorizontal ? "analytics-horizontal" : (isMini ? "analytics-mini-list" : "analytics-grid")}>
                    {[...Array(skeletonCount)].map((_, i) => (
                        <div key={i} className={isHorizontal ? "card analytics-card-mini" : (isMini ? "card rail-card-mini" : "analytics-item")}>
                            <div className="loading-shimmer skeleton" style={{ height: '0.8rem', marginBottom: '0.4rem', width: '60%' }} />
                            <div className="loading-shimmer skeleton" style={{ height: '1.2rem', width: '80%' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const baseMetrics = [
        { label: 'Price', value: data ? formatPrice(data.price) : '—' },
        { label: '24h Change', value: data ? formatChange(data.change24h) : '—', isChange: true, val: data?.change24h },
        { label: '7d Change', value: data ? formatChange(data.change7d) : '—', isChange: true, val: data?.change7d },
        { label: '24h Volume', value: data ? formatVolume(data.volume24h) : '—' },
    ];

    // Chain-specific metrics
    const chainMetrics = [];
    if (chainId === 'sol') {
        chainMetrics.push(
            { label: 'Fee Level', value: data?.feeLevel || '—', sub: data?.feeLevelValue },
            { label: 'Network Activity', value: data?.activity || '—' }
        );
    } else if (chainId === 'eth') {
        chainMetrics.push(
            { label: 'Gas Price', value: data?.gasIndicator || '—', sub: data?.gasValue },
            { label: 'Network Fee Level', value: data?.baseFee || '—' }
        );
    } else if (chainId === 'btc') {
        chainMetrics.push(
            { label: 'Mempool Pressure', value: data?.mempoolLevel || '—' }
        );
    }

    const allMetrics = (isMini || isHorizontal) ? [...baseMetrics.slice(1, 4), ...chainMetrics.slice(0, 1)] : [...baseMetrics, ...chainMetrics];

    return (
        <section className={isMini || isHorizontal ? "" : "section"}>
            {(!isMini && !isHorizontal) && <h2 className="section-title"><span className="icon">◈</span> Quick Analytics</h2>}
            <div className={isHorizontal ? "analytics-horizontal" : (isMini ? "analytics-mini-list" : "analytics-grid")}>
                {allMetrics.map((m, i) => (
                    <div key={i} className={isHorizontal ? "card analytics-card-mini" : (isMini ? "card rail-card-mini" : "analytics-item")}>
                        <div className="analytics-label" style={(isMini || isHorizontal) ? { fontSize: '0.65rem' } : {}}>{m.label}</div>
                        <div className={`analytics-value ${m.isChange ? (m.val >= 0 ? 'change-positive' : 'change-negative') : ''}`} style={(isMini || isHorizontal) ? { fontSize: '0.9rem' } : {}}>
                            {m.value}
                        </div>
                        {m.sub && <div className="analytics-sub" style={(isMini || isHorizontal) ? { fontSize: '0.6rem' } : {}}>{m.sub}</div>}
                    </div>
                ))}
            </div>
            {(!isMini && !isHorizontal) && data && (
                <div className="analytics-updated">
                    Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
                </div>
            )}
        </section>
    );
}

