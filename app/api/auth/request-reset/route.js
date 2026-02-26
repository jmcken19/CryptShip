import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { findUserById, findUserByEmail, createResetCode, countRecentResetCodes } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cryptship-dev-secret';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            // Don't reveal whether the email exists
            return NextResponse.json({ message: 'If an account with that email exists, a reset code has been sent.' });
        }

        // Rate limit: max 3 codes per 10 minutes
        const recentCount = countRecentResetCodes(user.id, 10);
        if (recentCount >= 3) {
            return NextResponse.json({ error: 'Too many reset requests. Please wait 10 minutes.' }, { status: 429 });
        }

        // Generate 6-digit code
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        createResetCode(user.id, code, expiresAt);

        // In production: send email via SendGrid/SES/etc.
        // For MVP: log to console
        console.log('====================================');
        console.log(`[PASSWORD RESET] Code for ${email}: ${code}`);
        console.log(`[PASSWORD RESET] Expires at: ${expiresAt}`);
        console.log('====================================');

        return NextResponse.json({
            message: 'If an account with that email exists, a reset code has been sent.',
            // DEV ONLY: include code in response for testing
            ...(process.env.NODE_ENV !== 'production' && { devCode: code }),
        });
    } catch (error) {
        console.error('Reset request error:', error);
        return NextResponse.json({ error: 'Failed to process reset request' }, { status: 500 });
    }
}
