'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        function updateClock() {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            }));
            setDate(now.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }));
        }
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero section">
            <div className="hero-clock">
                <span className="pulse-dot" />
                <span>{time}</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{date}</span>
            </div>

            <h1>Cryptship</h1>

            <p className="hero-subtitle">
                Shipping users to the blockchain — safely and confidently.
            </p>

            <p className="hero-description">
                Guided onboarding voyages for SOL, ETH, and BTC. Build wallet fundamentals,
                learn how to read the network, and move safely.
            </p>
        </section>
    );
}
