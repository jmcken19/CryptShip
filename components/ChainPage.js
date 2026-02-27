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
            {/* Header Section */}
            <section className="chain-hero-header">
                <h1 style={{ color: chain.color }}>{chain.name} Wallet Voyage</h1>
                <p className="chain-description">
                    Follow the Sea Route to safely navigate {chain.name} and fund your first wallet.
                </p>

                <div className="chain-price-block" style={{ marginTop: '1rem' }}>
                    <span className="chain-price" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        <AnimatedValue value={marketData ? marketData.price : null} formatter={marketData ? formatPrice : () => '—'} />
                    </span>
                    <span className={`chain-price-change ${marketData?.change24h >= 0 ? 'change-positive' : 'change-negative'}`} style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>
                        {marketData ? formatChange(marketData.change24h) : '—'} (24h)
                    </span>
                </div>
            </section>

            {/* Compact Chart Area */}
            <section className="chart-compact card">
                <PriceChart coin={chainId} color={chain.color} />
            </section>

            {/* Horizontal Analytics directly below chart */}
            <QuickAnalytics chainId={chainId} chainConfig={chain} isHorizontal={true} />

            {/* Main Feature: Sea Route Voyage (Full Width) */}
            <div className="voyage-focus-container">
                <VoyageRail chain={chainId} waypoints={waypoints} />
            </div>
        </div>
    );
}


