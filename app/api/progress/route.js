import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getProgress } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cryptship-dev-secret';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function GET() {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const progress = getProgress(user.userId);

    // Transform into { sol: { 1: true, 2: false, ... }, eth: {...}, btc: {...} }
    const result = { sol: {}, eth: {}, btc: {} };
    for (const row of progress) {
        if (!result[row.chain]) result[row.chain] = {};
        result[row.chain][row.waypoint] = row.completed === 1;
    }

    return NextResponse.json(result);
}

export async function POST(request) {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { chain, waypoint, completed } = await request.json();

    if (!chain || !waypoint) {
        return NextResponse.json({ error: 'Chain and waypoint required' }, { status: 400 });
    }

    if (!['sol', 'eth', 'btc'].includes(chain)) {
        return NextResponse.json({ error: 'Invalid chain' }, { status: 400 });
    }

    if (waypoint < 1 || waypoint > 6) {
        return NextResponse.json({ error: 'Invalid waypoint' }, { status: 400 });
    }

    const { setProgress } = await import('@/lib/db');
    setProgress(user.userId, chain, waypoint, completed);
    return NextResponse.json({ success: true });
}
