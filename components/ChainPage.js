'use client';

import { chains } from '@/data/chainConfig';
import { getWaypoints } from '@/data/waypoints';
import PriceChart from '@/components/PriceChart';
import QuickAnalytics from '@/components/QuickAnalytics';
import ChainHeadlines from '@/components/ChainHeadlines';
import VoyageRail from '@/components/VoyageRail';
import AnimatedValue from '@/components/AnimatedValue';
import { useState, useEffect } from 'react';

function formatPrice(price) {
    if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '$' + price.toFixed(2);
}

function formatChange(val) {
    if (val == null) return '—';
    const prefix = val >= 0 ? '+' : '';
    return prefix + val.toFixed(2) + '%';
}

export default function ChainPage({ chainId }) {
    const chain = chains[chainId];
    const waypoints = getWaypoints(chainId);
    const [marketData, setMarketData] = useState(null);

    useEffect(() => {
        fetch('/api/market-snapshot')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && data.ok !== false) setMarketData(data[chainId]);
            })
            .catch(() => { });
    }, [chainId]);

    return (
        <div className="page-container">
            {/* 1. Header & Price Snapshot */}
            <section className="chain-hero-header">
                <h1 style={{ color: chain.color }}>{chain.name} Wallet Trading Steps</h1>
                <p className="chain-description">
                    Complete all 6 waypoints to set up and safely fund your {chain.name} wallet for on-chain trading.
                </p>

                <div className="chain-price-block" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <span className="chain-price" style={{ fontSize: '2.5rem' }}>
                        <AnimatedValue value={marketData ? marketData.price : null} formatter={marketData ? formatPrice : () => '—'} />
                    </span>
                    <div className="chain-price-changes">
                        <span className={`chain-price-change ${marketData?.change24h >= 0 ? 'change-positive' : 'change-negative'}`}>
                            <small>24h</small> {marketData ? formatChange(marketData.change24h) : '—'}
                        </span>
                        <span className={`chain-price-change ${marketData?.change7d >= 0 ? 'change-positive' : 'change-negative'}`}>
                            <small>7d</small> {marketData ? formatChange(marketData.change7d) : '—'}
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. Full Width Chart Container */}
            <section className="full-width-chart-container card">
                <PriceChart coin={chainId} color={chain.color} />
                <p className="text-muted mt-sm" style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                    Prices update periodically and may not reflect real-time market movements.
                </p>
            </section>

            {/* 3. Three-Column Expanded Grid */}
            <div className="chain-page-grid">
                {/* Left Margin: Analytics */}
                <aside className="chain-rail-left">
                    <div className="rail-label" style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5, marginBottom: 'var(--space-xs)' }}>
                        Analytics
                    </div>
                    <QuickAnalytics chainId={chainId} chainConfig={chain} isMini />
                </aside>

                {/* Center Main: Voyage */}
                <div className="voyage-center-column">
                    <VoyageRail chain={chainId} waypoints={waypoints} />
                </div>

                {/* Right Margin: Headlines */}
                <aside className="chain-rail-right">
                    <div className="rail-label" style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5, marginBottom: 'var(--space-xs)' }}>
                        Latest News
                    </div>
                    <ChainHeadlines chainId={chainId} isMini />
                </aside>
            </div>
        </div>
    );
}


