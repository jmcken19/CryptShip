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
            <div className="chain-page-grid">
                {/* 1. MAIN COLUMN: Voyage Focus */}
                <div className="voyage-main-column">
                    <section className="chain-hero-min">
                        <h1 style={{ color: chain.color }}>{chain.name} Wallet Trading Steps</h1>
                        <p className="chain-description">
                            Complete all 6 waypoints to set up and safely fund your {chain.name} wallet for on-chain trading.
                        </p>
                    </section>

                    <section className="voyage-section">
                        <VoyageRail chain={chainId} waypoints={waypoints} />
                    </section>
                </div>

                {/* 2. SIDE COLUMN: Market Panel */}
                <aside className="market-panel-side">
                    {/* Price Block */}
                    <div className="card market-snapshot-mini">
                        <div className="chain-price-block">
                            <span className="chain-price" style={{ fontSize: '1.5rem' }}>
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
                        <p className="text-muted mt-sm" style={{ fontSize: '0.7rem' }}>
                            Prices update periodically and may not reflect real-time market movements.
                        </p>
                    </div>

                    {/* Chart */}
                    <div className="card chart-mini">
                        <PriceChart coin={chainId} color={chain.color} />
                    </div>

                    {/* Analytics */}
                    <QuickAnalytics chainId={chainId} chainConfig={chain} />

                    {/* Headlines */}
                    <ChainHeadlines chainId={chainId} />
                </aside>
            </div>
        </div>
    );
}

