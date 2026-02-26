'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

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

    // Calculate ship position for the curved rail
    // We'll use a CSS variable or direct style to position the ship along the rail
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

    // Island Silhouette SVG
    const Island = ({ active, completed }) => (
        <svg viewBox="0 0 24 24" width="32" height="32" className={`island-icon ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
            <path d="M2 20c4-2 6-2 10 0s6 2 10 0v2H2v-2z" fill="currentColor" opacity="0.3" />
            <path d="M6 18c2-4 6-8 12-4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M12 10c-1-2-3-3-5-1s-1 4 2 5" fill="currentColor" opacity={active ? 1 : 0.6} />
        </svg>
    );

    const isFullyComplete = Object.values(completedWaypoints).filter(Boolean).length === waypoints.length;

    return (
        <div className="voyage-layout">
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

            {/* Mobile Route Strip */}
            <div className="mobile-route-strip">
                <div className="route-strip-track">
                    {waypoints.map((wp) => (
                        <div
                            key={wp.id}
                            className={`route-strip-node ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                            onClick={() => scrollToWaypoint(wp.id)}
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
                    <div className="rail-title">Sea Route</div>
                    <button className="btn-reset-voyage" onClick={() => setShowResetModal(true)}>
                        Start over
                    </button>
                </div>

                <div className="sea-route-container">
                    {/* The curved route line is handled in CSS */}
                    <div className="sea-route-line"></div>

                    {/* Ship Indicator */}
                    <div
                        className="ship-indicator"
                        style={{ top: `calc(${shipProgress * 100}% - 12px)` }}
                    >
                        <PirateShip />
                    </div>

                    {waypoints.map((wp) => (
                        <div
                            key={wp.id}
                            className={`sea-waypoint ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                            onClick={() => scrollToWaypoint(wp.id)}
                            style={{ top: `${(wp.id - 1) * (100 / (waypoints.length - 1 || 1))}%` }}
                        >
                            <div className="waypoint-marker">
                                <Island active={activeWaypoint === wp.id} completed={completedWaypoints[wp.id]} />
                                {completedWaypoints[wp.id] && <span className="check-indicator">✓</span>}
                            </div>
                            <div className="waypoint-info">
                                <span className="wp-id">Waypoint {wp.id}</span>
                                <span className="wp-title">{wp.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Waypoint Cards */}
            <div className="voyage-content">
                {waypoints.map((wp) => (
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
                                    <a href={wp.actionLink} target="_blank" rel="noopener noreferrer" className="action-link">
                                        {wp.actionLink.includes('coinbase.com/join') ? 'coinbase.com/join' : wp.actionLink.replace('https://', '').replace('www.', '')}
                                    </a>
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
                        <div className="complete-icon">🎉</div>
                        <h3>Voyage Complete!</h3>
                        <p>You&apos;ve mastered the foundations of {chain.toUpperCase()} wallet trading.</p>
                        <Link href="/" className="btn btn-primary">Return to Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
