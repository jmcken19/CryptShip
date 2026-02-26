'use client';

import { useState, useEffect } from 'react';

export default function ChainHeadlines({ chainId }) {
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
            <section className="section">
                <h2 className="section-title"><span className="icon">◈</span> Headlines</h2>
                <div className="card">
                    <div className="loading-shimmer skeleton" style={{ height: '150px' }} />
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <h2 className="section-title">
                <span className="icon">◈</span> Headlines
            </h2>
            <div className="card">
                {headlines.length === 0 ? (
                    <p className="text-muted">No headlines available.</p>
                ) : (
                    headlines.map((item) => (
                        <div key={item.id} className="headline-item">
                            <span className="headline-title">
                                {item.url ? (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {item.title}
                                    </a>
                                ) : (
                                    item.title
                                )}
                            </span>
                            <span className="headline-meta">
                                <span className="headline-source">{item.source}</span>
                                <span>{item.timestamp}</span>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
