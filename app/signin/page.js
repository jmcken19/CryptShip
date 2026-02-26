'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            router.push('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="auth-page">
                <div className="card auth-card">
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            {isLogin ? 'Welcome Back' : 'Join Cryptship'}
                        </h1>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                            {isLogin
                                ? 'Sign in to continue your voyages.'
                                : 'Create an account to save your progress.'}
                        </p>
                    </div>

                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? '••••••••' : 'Min 6 characters'}
                                required
                                minLength={6}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading
                                ? '...'
                                : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-muted" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1.5rem' }}>
                        By signing in you agree to our educational terms. This platform does not provide financial advice.
                    </p>
                </div>
            </div>
        </div>
    );
}
