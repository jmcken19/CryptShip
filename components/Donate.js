'use client';

import { useState } from 'react';

export default function Donate() {
    const [copied, setCopied] = useState('');

    const donations = [
        { chain: 'SOL', color: '#9945FF', address: 'DmmG534DDnxirxBcXdLdKkjgeh8S9BXpsSMtcyzW8QrS' },
        { chain: 'ETH', color: '#627EEA', address: '0x59d48f1B003611Ef368f90B6dC6b8986194baCAe' },
        { chain: 'BTC', color: '#F7931A', address: '3JmjGUa74g3sNsDvi559Fh7FGrB37nbee5' },
    ];

    const handleCopy = (address, chain) => {
        navigator.clipboard.writeText(address);
        setCopied(chain);
        setTimeout(() => setCopied(''), 2000);
    };

    const truncateAddress = (addr) => {
        if (!addr) return '';
        if (addr.length < 15) return addr;
        return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
    };

    return (
        <section className="section">
            <h2 className="section-title">
                Support Cryptship
            </h2>
            <p className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>
                Crypto-only donations go directly to the developer and support ongoing Cryptship development.
            </p>

            <div className="donate-grid">
                {donations.map((d) => (
                    <div key={d.chain} className="card donate-card">
                        <div className="donate-chain" style={{ color: d.color }}>
                            {d.chain}
                        </div>
                        <div className="donate-qr-placeholder" style={{ padding: '0.5rem', overflow: 'hidden', border: `2px solid ${d.color}33`, background: 'white', width: '180px', height: '180px', margin: '0 auto 1rem auto' }}>
                            <img
                                src={`/qr/${d.chain.toLowerCase()}.png`}
                                alt={`${d.chain} QR Code`}
                                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
                            />
                        </div>
                        <div className="donate-address">{truncateAddress(d.address)}</div>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleCopy(d.address, d.chain)}
                        >
                            {copied === d.chain ? 'Copied!' : 'Copy Address'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
