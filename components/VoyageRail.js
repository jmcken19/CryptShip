'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getWaypoints } from '@/data/waypoints';

export default function VoyageRail({ chain, waypoints }) {
    const [completedWaypoints, setCompletedWaypoints] = useState({});
    const [activeWaypoint, setActiveWaypoint] = useState(1);
    const [toastMsg, setToastMsg] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const waypointRefs = useRef({});
    const railRef = useRef(null);

    // Provide a helper to load safely
    const loadProgress = useCallback(() => {
        try {
            const raw = localStorage.getItem(`cryptship_progress_${chain}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.completed)) {
                    // Convert array [1,2] to object {1: true, 2: true} for easier component logic
                    const mapped = {};
                    parsed.completed.forEach(id => { mapped[id] = true; });
                    setCompletedWaypoints(mapped);
                    return;
                }
            }
        } catch { }
        setCompletedWaypoints({});
    }, [chain]);

    // Load progress on mount
    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    // ScrollSpy
    useEffect(() => {
        const observers = [];
        waypoints.forEach((wp) => {
            const el = waypointRefs.current[wp.id];
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveWaypoint(wp.id);
                    }
                },
                { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, [waypoints]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toastMsg) {
            const timer = setTimeout(() => setToastMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMsg]);

    const scrollToWaypoint = useCallback((id) => {
        const el = waypointRefs.current[id];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const handleCheckbox = useCallback((waypointId, checked) => {
        const updatedObj = { ...completedWaypoints, [waypointId]: checked };

        // Save to LocalStorage in user-requested format
        try {
            const completedArr = Object.keys(updatedObj).filter(k => updatedObj[k]).map(Number);
            const savePayload = {
                completed: completedArr,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`cryptship_progress_${chain}`, JSON.stringify(savePayload));
        } catch {
            setToastMsg('Failed to save progress offline.');
            return;
        }

        // Save succeeded — update state
        setCompletedWaypoints(updatedObj);

        // Auto-advance to next waypoint on completion
        if (checked) {
            const nextWp = waypoints.find(wp => wp.id === waypointId + 1);
            if (nextWp) {
                setTimeout(() => {
                    scrollToWaypoint(nextWp.id);
                    setActiveWaypoint(nextWp.id);
                }, 350); // Small delay for visual feedback
            }
        }
    }, [completedWaypoints, chain, waypoints, scrollToWaypoint]);

    const handleReset = () => {
        localStorage.removeItem(`cryptship_progress_${chain}`);
        setCompletedWaypoints({});
        setShowResetModal(false);
        scrollToWaypoint(1);
        setActiveWaypoint(1);
    };

    // Device Preference
    const [devicePref, setDevicePref] = useState(null); // 'mobile', 'web', 'both'
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [tempPref, setTempPref] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(`cryptship_device_${chain}`);
        if (saved) {
            setDevicePref(saved);
        } else {
            setShowDeviceModal(true);
        }
    }, [chain]);

    const handleSetDevice = () => {
        if (!tempPref) {
            setValidationError('Please select Mobile, Web, or Both to continue.');
            return;
        }
        setDevicePref(tempPref);
        localStorage.setItem(`cryptship_device_${chain}`, tempPref);
        setShowDeviceModal(false);
        setValidationError('');
    };

    const waypointsWithPref = getWaypoints(chain, devicePref || 'both');

    // Calculate ship position for the curved rail
    const shipProgress = (activeWaypoint - 1) / (waypoints.length - 1 || 1);

    // Ship Glyph SVG
    const PirateShip = () => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M4 18h16l-2 3H6l-2-3z" />
            <path d="M11 5v13h2V5h-2z" />
            <path d="M13 6l6 4-6 4V6z" />
            <rect x="12" y="2" width="6" height="3" fill="var(--gold-400)" />
        </svg>
    );



    const handleShare = useCallback(() => {
        const chainName = chain.toUpperCase();
        const origin = typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? 'https://cryptship.com' : window.location.origin) : 'https://cryptship.com';
        const url = `${origin}/${chain}`;
        const text = `Just completed the Cryptship voyage and set up my wallet trading foundations for ${chainName}. Shipping trading on-chain, safely.`;
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(intentUrl, "_blank", "noopener,noreferrer");
    }, [chain]);

    const isFullyComplete = Object.values(completedWaypoints).filter(Boolean).length === waypoints.length;

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className={`voyage-layout ${!devicePref ? 'voyage-locked' : ''}`}>
            {/* Toast */}
            {toastMsg && <div className="toast-error" role="alert">{toastMsg}</div>}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="modal-overlay">
                    <div className="modal-card card">
                        <h3>Reset Voyage?</h3>
                        <p className="text-muted">This will clear your progress for this {chain.toUpperCase()} voyage.</p>
                        <div className="modal-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => setShowResetModal(false)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={handleReset}>Yes, Reset</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Device Preference Modal */}
            {showDeviceModal && (
                <div className="modal-overlay">
                    <div className="modal-card card" style={{ maxWidth: '400px' }}>
                        <h3>Choose your setup</h3>
                        <p className="text-muted mb-lg">Select how you want to set up your wallet.</p>

                        <div className="device-options" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                            <label className={`device-option card ${tempPref === 'mobile' ? 'selected' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                <input type="radio" name="device" checked={tempPref === 'mobile'} onChange={() => { setTempPref('mobile'); setValidationError(''); }} />
                                <div>
                                    <div style={{ fontWeight: '700' }}>Mobile</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Phone or Tablet</div>
                                </div>
                            </label>
                            <label className={`device-option card ${tempPref === 'web' ? 'selected' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                <input type="radio" name="device" checked={tempPref === 'web'} onChange={() => { setTempPref('web'); setValidationError(''); }} />
                                <div>
                                    <div style={{ fontWeight: '700' }}>Web</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Browser extension</div>
                                </div>
                            </label>
                            <label className={`device-option card ${tempPref === 'both' ? 'selected' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                <input type="radio" name="device" checked={tempPref === 'both'} onChange={() => { setTempPref('both'); setValidationError(''); }} />
                                <div>
                                    <div style={{ fontWeight: '700' }}>Both</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Synced setup</div>
                                </div>
                            </label>
                        </div>

                        {validationError && (
                            <div className="form-error mb-md" style={{ textAlign: 'center', fontWeight: '600' }}>{validationError}</div>
                        )}

                        <button
                            className={`btn btn-primary w-full ${!tempPref ? 'btn-disabled' : ''}`}
                            onClick={handleSetDevice}
                        >
                            Start Voyage
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Route Strip */}
            <div className="mobile-route-strip">
                <div className="route-strip-track">
                    {waypoints.map((wp) => (
                        <div
                            key={wp.id}
                            className={`route-strip-node ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                            onClick={() => devicePref && scrollToWaypoint(wp.id)}
                            style={{ cursor: devicePref ? 'pointer' : 'not-allowed' }}
                        >
                            <span className="node-icon">
                                {activeWaypoint === wp.id ? <PirateShip /> : <div className="island-dot" />}
                            </span>
                            <span className="node-label">WP {wp.id}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Rail */}
            <aside className="voyage-rail" ref={railRef}>
                <div className="rail-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="rail-title">Sea Route</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="mode-badge">Mode: {devicePref ? capitalize(devicePref) : 'Locked'}</span>
                            <button className="change-link" onClick={() => setShowDeviceModal(true)}>
                                Change
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <button className="btn-reset-voyage" onClick={() => setShowResetModal(true)} style={{ fontSize: '0.65rem' }}>
                            Start over
                        </button>
                    </div>
                </div>

                <div className="sea-route-container" style={{ opacity: devicePref ? 1 : 0.3, pointerEvents: devicePref ? 'all' : 'none' }}>
                    {/* Simplified SVG Route Path */}
                    <svg className="sea-route-svg" preserveAspectRatio="none" viewBox="0 0 40 100" style={{ position: 'absolute', left: 0, top: 0, width: '40px', height: '100%', overflow: 'visible' }}>
                        <path
                            d="M 12 0 Q 30 25, 12 50 T 12 100"
                            fill="none"
                            stroke="var(--navy-800)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.4"
                        />
                        <path
                            d="M 12 0 Q 30 25, 12 50 T 12 100"
                            fill="none"
                            stroke="var(--ocean-500)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="4 6"
                            opacity="0.3"
                        />
                    </svg>

                    {/* Ship Indicator - positioned relative to the center line (12px) */}
                    <div
                        className="ship-wrapper"
                        style={{
                            top: `${shipProgress * 100}%`,
                            left: '12px',
                        }}
                    >
                        <div className="ship-indicator">
                            <PirateShip />
                        </div>
                    </div>

                    {waypoints.map((wp) => {
                        const topPos = (wp.id - 1) * (100 / (waypoints.length - 1 || 1));
                        return (
                            <div
                                key={wp.id}
                                className={`sea-waypoint ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                                onClick={() => devicePref && scrollToWaypoint(wp.id)}
                                style={{ top: `${topPos}%`, cursor: devicePref ? 'pointer' : 'not-allowed' }}
                            >
                                <div className="waypoint-marker" style={{ left: '12px' }}>
                                    <div className={`waypoint-dot ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`} />
                                </div>
                                <div className="waypoint-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="wp-label">WP {wp.id}</span>
                                        {completedWaypoints[wp.id] && <span className="check-indicator-inline">✓</span>}
                                    </div>
                                    <span className="wp-name">{wp.title}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Waypoint Cards */}
            <div className="voyage-content">
                {!devicePref ? (
                    <div className="card text-center" style={{ padding: 'var(--space-4xl)', opacity: 0.5 }}>
                        <div className="mb-lg">
                            <PirateShip />
                        </div>
                        <h3>Voyage Locked</h3>
                        <p className="text-muted">Please select your device preference to begin this journey.</p>
                        <button className="btn btn-primary mt-lg" onClick={() => setShowDeviceModal(true)}>
                            Open Selector
                        </button>
                    </div>
                ) : (
                    <>
                        {waypointsWithPref.map((wp) => (
                            <div
                                key={wp.id}
                                id={`waypoint-${wp.id}`}
                                ref={(el) => (waypointRefs.current[wp.id] = el)}
                                className={`card waypoint-card ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                            >
                                <div className="waypoint-card-header">
                                    <div className="waypoint-number">Waypoint {wp.id}</div>
                                    <h3 className="waypoint-title">{wp.title}</h3>
                                </div>

                                <div className="waypoint-body">
                                    <div className="waypoint-goal">
                                        <strong>Goal:</strong> {wp.goal}
                                    </div>

                                    <ul className="waypoint-points">
                                        {wp.points.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>

                                    <div className="waypoint-action">
                                        <strong>Action:</strong> {wp.action}
                                        {wp.actionLink && (
                                            <div className="action-links-container">
                                                {Array.isArray(wp.actionLink) ? (
                                                    wp.actionLink.map((link, idx) => (
                                                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="action-link">
                                                            {link.label}
                                                        </a>
                                                    ))
                                                ) : (
                                                    <a href={wp.actionLink} target="_blank" rel="noopener noreferrer" className="action-link">
                                                        {wp.actionLink.includes('coinbase.com/join') ? 'coinbase.com/join' : wp.actionLink.replace('https://', '').replace('www.', '').split('/')[0]}
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <label className="waypoint-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={!!completedWaypoints[wp.id]}
                                            onChange={(e) => handleCheckbox(wp.id, e.target.checked)}
                                        />
                                        <span className="waypoint-checkbox-label">Mark complete</span>
                                    </label>
                                </div>
                            </div>
                        ))}

                        {isFullyComplete && (
                            <div className="card voyage-complete-card">
                                <h3>Voyage Complete</h3>
                                <p>You&apos;ve mastered the foundations of {chain.toUpperCase()} wallet trading.</p>

                                <div className="complete-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-xl)' }}>
                                    <button onClick={handleShare} className="btn btn-primary" style={{ background: 'var(--gold-500)', color: 'var(--navy-950)', border: 'none', fontWeight: '800' }}>
                                        <span style={{ marginRight: '8px' }}>𝕏</span> Share on X
                                    </button>

                                    <Link href="/" className="btn btn-outline" style={{ minWidth: '150px' }}>
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
