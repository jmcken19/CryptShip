'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function VoyageRail({ chain, waypoints }) {
    const [completedWaypoints, setCompletedWaypoints] = useState({});
    const [activeWaypoint, setActiveWaypoint] = useState(1);
    const [toastMsg, setToastMsg] = useState('');
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
            setToastMsg('Failed to save progress offline. Note: Private mode limits saving.');
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

    // Calculate ship position
    const shipTop = `${(activeWaypoint - 1) * (100 / (waypoints.length - 1 || 1))}%`;
    const isFullyComplete = Object.values(completedWaypoints).filter(Boolean).length === waypoints.length;

    return (
        <div className="voyage-layout">
            {/* Toast */}
            {toastMsg && (
                <div className="toast-error" role="alert">
                    {toastMsg}
                </div>
            )}

            {/* Rail */}
            <aside className="voyage-rail" ref={railRef} aria-label="Voyage navigation">
                <div className="rail-title">Voyage Progress</div>
                <div className="rail-track">
                    <span
                        className="rail-ship"
                        style={{ top: shipTop }}
                        role="img"
                        aria-label="Your position"
                    >
                        ⛵
                    </span>
                    {waypoints.map((wp) => (
                        <div
                            key={wp.id}
                            className={`rail-waypoint ${activeWaypoint === wp.id ? 'active' : ''} ${completedWaypoints[wp.id] ? 'completed' : ''}`}
                            onClick={() => scrollToWaypoint(wp.id)}
                            onKeyDown={(e) => e.key === 'Enter' && scrollToWaypoint(wp.id)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Navigate to waypoint ${wp.id}: ${wp.title}`}
                        >
                            <span className="rail-waypoint-label">
                                {wp.id}. {wp.title}
                            </span>
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
                        <div className="waypoint-number">Waypoint {wp.id}</div>
                        <h3 className="waypoint-title">{wp.title}</h3>
                        <p className="waypoint-goal">{wp.goal}</p>

                        <ul className="waypoint-points">
                            {wp.points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>

                        <div className="waypoint-action">
                            <strong>Action:</strong> {wp.action}
                            {wp.actionLink && (
                                <>
                                    {' — '}
                                    <a href={wp.actionLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                                        {wp.actionLink.includes('coinbase.com/join') ? 'coinbase.com/join' : wp.actionLink.replace('https://', '').replace('www.', '')}
                                    </a>
                                </>
                            )}
                        </div>

                        <label className="waypoint-checkbox">
                            <input
                                type="checkbox"
                                checked={!!completedWaypoints[wp.id]}
                                onChange={(e) => handleCheckbox(wp.id, e.target.checked)}
                            />
                            <span className="waypoint-checkbox-label">{wp.checkbox}</span>
                        </label>
                    </div>
                ))}

                {isFullyComplete && (
                    <div className="card waypoint-card active" style={{ textAlign: 'center', borderColor: 'var(--teal-400)', marginTop: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 className="waypoint-title" style={{ color: 'var(--teal-400)', marginBottom: '0.5rem' }}>Voyage Complete!</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                            You've successfully completed your {chain.toUpperCase()} onboarding.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
