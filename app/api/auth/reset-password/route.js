import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findValidResetCode, markResetCodeUsed, updatePassword } from '@/lib/db';

export async function POST(request) {
    try {
        const { email, code, newPassword } = await request.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: 'Email, code, and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 });
        }

        const validCode = findValidResetCode(user.id, code);
        if (!validCode) {
            return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
        }

        // Update password
        const passwordHash = await bcrypt.hash(newPassword, 10);
        updatePassword(user.id, passwordHash);

        // Mark code as used
        markResetCodeUsed(validCode.id);

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
