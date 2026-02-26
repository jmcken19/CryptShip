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
            {/* A) Quick Overview */}
            <section className="chain-header section">
                <h1 style={{ color: chain.color }}>{chain.name}</h1>
                <p className="chain-description">{chain.description}</p>

                <div className="chain-price-block" style={{ marginTop: '1.5rem' }}>
                    <span className="chain-price">
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Prices update periodically and may not reflect real-time market movements.</span>
                </div>

                <PriceChart coin={chainId} color={chain.color} />
            </section>

            {/* B) Quick Analytics */}
            <QuickAnalytics chainId={chainId} chainConfig={chain} />

            {/* C) Headlines */}
            <ChainHeadlines chainId={chainId} />

            {/* D) Onboarding Voyage */}
            <section className="section">
                <h2 className="section-title">
                    {chain.name} Wallet Trading Steps
                </h2>
                <p className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>
                    Complete all 6 waypoints to set up and safely fund your wallet for trading.
                </p>
                <VoyageRail chain={chainId} waypoints={waypoints} />
            </section>
        </div>
    );
}
