'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function VoyageCTA() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (user) {
            fetch('/api/progress')
                .then(r => r.ok ? r.json() : null)
                .then(data => setProgress(data))
                .catch(() => { });
        }
    }, [user]);

    const chains = [
        { id: 'sol', name: 'Solana', symbol: 'SOL', color: '#9945FF' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    ];

    const TOTAL_WAYPOINTS = 6;

    function getChainProgress(chainId) {
        if (!progress || !progress[chainId]) return { completed: 0, total: TOTAL_WAYPOINTS, nextWaypoint: 1 };
        const entries = progress[chainId];
        let completed = 0;
        let nextWaypoint = 1;
        for (let i = 1; i <= TOTAL_WAYPOINTS; i++) {
            if (entries[i]) {
                completed++;
            }
        }
        for (let i = 1; i <= TOTAL_WAYPOINTS; i++) {
            if (!entries[i]) {
                nextWaypoint = i;
                break;
            }
        }
        if (completed === TOTAL_WAYPOINTS) nextWaypoint = TOTAL_WAYPOINTS;
        return { completed, total: TOTAL_WAYPOINTS, nextWaypoint };
    }

    return (
        <section className="section">
            <h2 className="section-title">
                <span className="icon">⛵</span> Start Your Voyage
            </h2>

            <div className="voyage-cta-grid">
                {chains.map((chain) => {
                    const p = getChainProgress(chain.id);
                    const pct = Math.round((p.completed / p.total) * 100);
                    const hasProgress = user && progress && p.completed > 0;

                    return (
                        <div key={chain.id} className="card voyage-cta-card">
                            <div className="voyage-cta-chain" style={{ color: chain.color }}>
                                {chain.symbol}
                            </div>

                            {hasProgress && (
                                <>
                                    <div className="voyage-progress-bar">
                                        <div className="voyage-progress-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="voyage-progress-text">
                                        {p.completed}/{p.total} waypoints · {pct}% complete
                                    </div>
                                </>
                            )}

                            <Link
                                href={`/${chain.id}`}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                {hasProgress
                                    ? `Continue from Waypoint ${p.nextWaypoint}`
                                    : `Start ${chain.symbol} Voyage`}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
