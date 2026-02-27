'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/sol', label: 'SOL' },
        { href: '/eth', label: 'ETH' },
        { href: '/btc', label: 'BTC' },
    ];

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    Cryptship
                </Link>

                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>

                <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={pathname === link.href ? 'active' : ''}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
