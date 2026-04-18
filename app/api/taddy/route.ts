import { NextResponse } from 'next/server';

const TADDY_API_KEY = process.env.TADDY_API_KEY!;
const TADDY_USER_ID = process.env.TADDY_USER_ID!;
const TADDY_API_URL = 'https://api.taddy.org/graphql';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    try {
        const response = await fetch(TADDY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': TADDY_API_KEY,
                'X-USER-ID': TADDY_USER_ID,
            },
            body: JSON.stringify({
                query: `
          query SearchPodcasts($term: String!) {
            search(term: $term, first: 20) {
              podcastSeries {
                uuid
                name
                description
                imageUrl
                episodes(first: 5) {
                  edges {
                    node {
                      uuid
                      name
                      description
                      audioUrl
                      duration
                    }
                  }
                }
              }
            }
          }
        `,
                variables: { term: q },
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Taddy API error:', error);
        return NextResponse.json({ error: 'Taddy API failed' }, { status: 500 });
    }
}