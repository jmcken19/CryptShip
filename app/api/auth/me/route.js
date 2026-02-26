import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { findUserById, updateLastVisit } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cryptship-dev-secret';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = findUserById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        updateLastVisit(user.id);

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at,
                lastLogin: user.last_login,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
