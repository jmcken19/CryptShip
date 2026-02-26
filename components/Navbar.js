'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/sol', label: 'SOL' },
        { href: '/eth', label: 'ETH' },
        { href: '/btc', label: 'BTC' },
    ];

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
        setMobileOpen(false);
    }, [pathname]);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    ⚓ Cryptship
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
                    <li>
                        {isLoading ? null : user ? (
                            <div className="nav-profile-wrapper" ref={dropdownRef}>
                                <button
                                    className="nav-profile-icon"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    aria-label="Account menu"
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="nav-dropdown">
                                        <Link href="/profile" className="nav-dropdown-item">
                                            Profile
                                        </Link>
                                        <button onClick={logout} className="nav-dropdown-item nav-dropdown-signout">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/signin" className="nav-cta" onClick={() => setMobileOpen(false)}>
                                Sign In
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
