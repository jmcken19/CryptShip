import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, updateLastLogin } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cryptship-dev-secret';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Update last login timestamp
        updateLastLogin(user.id);

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        const response = NextResponse.json({
            user: { id: user.id, email: user.email },
        });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
