import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return accessToken;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    try {
        const token = await getAccessToken();
        const spotifyRes = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=20`,
            {
                headers: { 'Authorization': `Bearer ${token}` },
            }
        );
        const data = await spotifyRes.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Spotify API error:', error);
        return NextResponse.json({ error: 'Spotify API failed' }, { status: 500 });
    }
}