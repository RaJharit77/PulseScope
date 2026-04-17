import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${keyword}&type=video&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    return NextResponse.json(data);
}