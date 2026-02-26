'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [resetStep, setResetStep] = useState('idle'); // 'idle' | 'requested' | 'verify'
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetMsg, setResetMsg] = useState('');
    const [resetError, setResetError] = useState('');
    const [devCode, setDevCode] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/signin');
            return;
        }
        if (user) {
            fetch('/api/auth/me')
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (data?.user) setProfile(data.user);
                });
        }
    }, [user, isLoading, router]);

    const handleRequestReset = async () => {
        setResetError('');
        setResetMsg('');
        setDevCode('');
        try {
            const res = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: profile.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setResetError(data.error || 'Failed to request code');
                return;
            }
            setResetMsg(data.message);
            setResetStep('verify');
            if (data.devCode) {
                setDevCode(data.devCode);
            }
        } catch {
            setResetError('Network error. Please try again.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetError('');
        setResetMsg('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: profile.email, code: resetCode, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setResetError(data.error || 'Failed to reset password');
                return;
            }
            setResetMsg('Password updated successfully!');
            setResetStep('idle');
            setResetCode('');
            setNewPassword('');
            setDevCode('');
        } catch {
            setResetError('Network error. Please try again.');
        }
    };

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function getAccountAge(dateStr) {
        if (!dateStr) return '—';
        const created = new Date(dateStr);
        const now = new Date();
        const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return '1 day';
        if (days < 30) return `${days} days`;
        const months = Math.floor(days / 30);
        if (months === 1) return '1 month';
        return `${months} months`;
    }

    if (isLoading) {
        return (
            <div className="page-container">
                <div className="auth-page">
                    <div className="card auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-shimmer skeleton" style={{ height: '200px' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-page">
                    <div className="card auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Please Sign In</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>You must be signed in to view your profile.</p>
                        <button onClick={() => router.push('/signin')} className="btn btn-primary">
                            Go to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-container">
                <div className="auth-page">
                    <div className="card auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-shimmer skeleton" style={{ height: '200px' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="auth-page" style={{ maxWidth: '500px' }}>
                <div className="card auth-card">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="profile-avatar-large">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.75rem' }}>Profile</h1>
                    </div>

                    <div className="profile-info-grid">
                        <div className="profile-info-item">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{profile.email}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-label">Account Created</span>
                            <span className="profile-info-value">{formatDate(profile.createdAt)}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-label">Account Age</span>
                            <span className="profile-info-value">{getAccountAge(profile.createdAt)}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-label">Last Login</span>
                            <span className="profile-info-value">{formatDate(profile.lastLogin)}</span>
                        </div>
                    </div>

                    {/* Password Reset */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(45, 212, 191, 0.1)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Security
                        </h2>

                        {resetMsg && <p style={{ color: 'var(--teal-400)', fontSize: '0.85rem', marginBottom: '1rem' }}>{resetMsg}</p>}
                        {resetError && <p className="form-error" style={{ marginBottom: '1rem' }}>{resetError}</p>}

                        {resetStep === 'idle' && (
                            <button onClick={handleRequestReset} className="btn btn-secondary" style={{ width: '100%' }}>
                                Reset Password
                            </button>
                        )}

                        {resetStep === 'verify' && (
                            <form onSubmit={handleResetPassword}>
                                {devCode && (
                                    <div style={{
                                        background: 'rgba(245, 166, 35, 0.08)',
                                        border: '1px solid rgba(245, 166, 35, 0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.75rem 1rem',
                                        marginBottom: '1rem',
                                        fontSize: '0.8rem',
                                        color: 'var(--gold-400)',
                                    }}>
                                        <strong>Dev Mode:</strong> Your reset code is <strong>{devCode}</strong>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reset-code">Reset Code</label>
                                    <input
                                        id="reset-code"
                                        type="text"
                                        className="form-input"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        placeholder="6-digit code"
                                        required
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="new-password">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        className="form-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => { setResetStep('idle'); setResetCode(''); setNewPassword(''); setDevCode(''); setResetError(''); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
