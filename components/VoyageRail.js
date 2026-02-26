'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function VoyageRail({ chain, waypoints }) {
    const { user } = useAuth();
    const [completedWaypoints, setCompletedWaypoints] = useState({});
    const [activeWaypoint, setActiveWaypoint] = useState(1);
    const [toastMsg, setToastMsg] = useState('');
    const waypointRefs = useRef({});
    const railRef = useRef(null);

    // Load progress
    useEffect(() => {
        if (user) {
            fetch('/api/progress')
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (data && data[chain]) {
                        setCompletedWaypoints(data[chain]);
                    }
                })
                .catch(() => { });
        } else {
            try {
                const local = JSON.parse(localStorage.getItem(`cryptship_progress_${chain}`) || '{}');
                setCompletedWaypoints(local);
            } catch { }
        }
    }, [user, chain]);

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

    const handleCheckbox = useCallback(async (waypointId, checked) => {
        const updated = { ...completedWaypoints, [waypointId]: checked };

        if (user) {
            try {
                const res = await fetch('/api/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chain, waypoint: waypointId, completed: checked }),
                });
                if (!res.ok) {
                    setToastMsg('Failed to save progress. Please try again.');
                    return; // Don't advance or update state
                }
            } catch (e) {
                setToastMsg('Failed to save progress. Check your connection.');
                return;
            }
        } else {
            try {
                localStorage.setItem(`cryptship_progress_${chain}`, JSON.stringify(updated));
            } catch {
                setToastMsg('Failed to save progress locally.');
                return;
            }
        }

        // Save succeeded — update state
        setCompletedWaypoints(updated);

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
    }, [completedWaypoints, user, chain, waypoints, scrollToWaypoint]);

    // Calculate ship position
    const shipTop = `${(activeWaypoint - 1) * (100 / (waypoints.length - 1 || 1))}%`;

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
                                    <a href={wp.actionLink} target="_blank" rel="noopener noreferrer">
                                        {wp.actionLink.replace('https://', '').replace('www.', '')}
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

                        {!user && completedWaypoints[wp.id] && (
                            <div className="sign-in-prompt">
                                <Link href="/signin">Sign in</Link> to save your progress across devices.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
