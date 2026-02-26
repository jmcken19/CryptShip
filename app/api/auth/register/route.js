import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cryptship-dev-secret';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const existing = findUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = createUser(email, passwordHash);

        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

        const response = NextResponse.json({
            user: { id: userId, email },
            message: 'Account created successfully',
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
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
