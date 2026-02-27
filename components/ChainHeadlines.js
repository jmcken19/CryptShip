'use client';

import { useState, useEffect } from 'react';

export default function ChainHeadlines({ chainId, isMini = false }) {
    const [headlines, setHeadlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/news?scope=${chainId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && data.headlines) {
                    setHeadlines(data.headlines);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [chainId]);

    if (loading) {
        return (
            <section className={isMini ? "" : "section"}>
                {!isMini && <h2 className="section-title">Headlines</h2>}
                <div className={isMini ? "card rail-card-mini" : "card"}>
                    <div className="loading-shimmer skeleton" style={{ height: isMini ? '80px' : '150px' }} />
                </div>
            </section>
        );
    }

    return (
        <section className={isMini ? "" : "section"}>
            {!isMini && <h2 className="section-title">Headlines</h2>}
            <div className={isMini ? "card rail-card-mini" : "card"} style={isMini ? { padding: 'var(--space-md)' } : {}}>
                {headlines.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>No headlines available.</p>
                ) : (
                    headlines.slice(0, isMini ? 4 : undefined).map((item) => (
                        <div key={item.id} className="headline-item" style={isMini ? { padding: 'var(--space-xs) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}}>
                            <span className="headline-title" style={isMini ? { fontSize: '0.75rem', lineHeight: '1.4' } : {}}>
                                {item.url ? (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {item.title}
                                    </a>
                                ) : (
                                    item.title
                                )}
                            </span>
                            {!isMini && (
                                <span className="headline-meta">
                                    <span className="headline-source">{item.source}</span>
                                    <span>{item.timestamp}</span>
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

