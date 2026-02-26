'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function VoyageCTA() {
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        // Read progress from localStorage for each active chain
        const localProgress = {};
        const chains = ['sol', 'eth', 'btc'];

        chains.forEach(c => {
            try {
                const stored = localStorage.getItem(`cryptship_progress_${c}`);
                if (stored) {
                    localProgress[c] = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Failed to parse localStorage for', c, e);
            }
        });

        setProgress(localProgress);
    }, []);

    const chains = [
        { id: 'sol', name: 'Solana', symbol: 'SOL', color: '#9945FF' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    ];

    const TOTAL_WAYPOINTS = 6;

    function getChainProgress(chainId) {
        if (!progress || !progress[chainId] || !Array.isArray(progress[chainId].completed)) {
            return { completed: 0, total: TOTAL_WAYPOINTS, nextWaypoint: 1 };
        }

        const completedArr = progress[chainId].completed;
        let completed = completedArr.length;
        if (completed > TOTAL_WAYPOINTS) completed = TOTAL_WAYPOINTS;

        // Find next lowest missing waypoint
        let nextWaypoint = 1;
        for (let i = 1; i <= TOTAL_WAYPOINTS; i++) {
            if (!completedArr.includes(i)) {
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
                Start Your Voyage
            </h2>

            <div className="voyage-cta-grid">
                {chains.map((chain) => {
                    const p = getChainProgress(chain.id);
                    const pct = Math.round((p.completed / p.total) * 100);
                    const hasProgress = progress && progress[chain.id] && p.completed > 0;
                    const isFullyComplete = p.completed === p.total;

                    return (
                        <div key={chain.id} className="card voyage-cta-card">
                            <div className="voyage-cta-chain" style={{ color: chain.color }}>
                                {chain.symbol}
                            </div>

                            {hasProgress && (
                                <>
                                    <div className="voyage-progress-bar">
                                        <div className="voyage-progress-fill" style={{ width: `${pct}%`, backgroundColor: isFullyComplete ? 'var(--teal-400)' : 'var(--blue-400)' }} />
                                    </div>
                                    <div className="voyage-progress-text">
                                        {p.completed}/{p.total} waypoints · {pct}% complete
                                    </div>
                                </>
                            )}

                            <Link
                                href={`/${chain.id}`}
                                className={`btn ${isFullyComplete ? 'btn-outline' : 'btn-primary'}`}
                                style={{ width: '100%' }}
                            >
                                {!hasProgress
                                    ? `Start ${chain.symbol} Voyage`
                                    : isFullyComplete
                                        ? `Review ${chain.symbol} Voyage`
                                        : `Continue from Waypoint ${p.nextWaypoint}`
                                }
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
