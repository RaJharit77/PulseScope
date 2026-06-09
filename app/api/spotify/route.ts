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

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Spotify token error', res.status, errorText);
        throw new Error(`Spotify authentication failed: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return accessToken;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const q = searchParams.get('q');

    // Option pour les nouveautés Spotify (albums) – pas de paramètre `q`
    if (type === 'new-releases') {
        try {
            const token = await getAccessToken();
            const spotifyRes = await fetch(
                `https://api.spotify.com/v1/browse/new-releases?limit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!spotifyRes.ok) {
                const errorText = await spotifyRes.text();
                console.error('Spotify API error', spotifyRes.status, errorText);
                return NextResponse.json({ error: `Spotify API error: ${spotifyRes.status}` }, { status: 502 });
            }
            const data = await spotifyRes.json();
            return NextResponse.json(data);
        } catch (error) {
            console.error('Spotify new-releases error:', error);
            return NextResponse.json({ error: 'Spotify API failed' }, { status: 500 });
        }
    }

    // Recherche classique (track ou episode)
    if (!q) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    try {
        const token = await getAccessToken();
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=20`;
        const spotifyRes = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!spotifyRes.ok) {
            const errorText = await spotifyRes.text();
            console.error('Spotify API error', spotifyRes.status, errorText);
            return NextResponse.json({ error: `Spotify API error: ${spotifyRes.status}` }, { status: 502 });
        }

        const data = await spotifyRes.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Spotify API error:', error);
        return NextResponse.json({ error: 'Spotify API failed' }, { status: 500 });
    }
}