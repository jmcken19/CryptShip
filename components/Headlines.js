'use client';

import { useState, useEffect } from 'react';

export default function Headlines() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/news?scope=global')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setData(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="section">
                <h2 className="section-title"><span className="icon">◈</span> Today in Crypto</h2>
                <div className="loading-shimmer skeleton" style={{ height: '200px' }} />
            </section>
        );
    }

    if (!data) return null;

    return (
        <section className="section">
            <h2 className="section-title">
                <span className="icon">◈</span> Today in Crypto
            </h2>

            {data.bullets && (
                <ul className="headlines-bullets">
                    {data.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                    ))}
                </ul>
            )}

            <h3 className="section-title" style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>
                Top Headlines
            </h3>
            <div>
                {data.headlines.map((item) => (
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
                ))}
            </div>
        </section>
    );
}
