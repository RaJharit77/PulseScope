import { NextResponse } from 'next/server';

const TADDY_API_KEY = process.env.TADDY_API_KEY!;
const TADDY_USER_ID = process.env.TADDY_USER_ID!;
const TADDY_API_URL = 'https://api.taddy.org/graphql';

const TIMEOUT_MS = 8000;

interface TaddyPodcastSeries {
  uuid: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface TaddyEpisodeNode {
  uuid: string;
  name: string;
  description: string;
  audioUrl: string;
  duration: number;
}

interface TaddySearchResult {
  data?: {
    search?: {
      searchId?: string;
      podcastSeries?: TaddyPodcastSeries[];
    };
  };
  errors?: Array<{ message: string }>;
}

interface TaddyEpisodesResult {
  data?: {
    getPodcastSeries?: {
      uuid: string;
      episodes?: TaddyEpisodeNode[];
    };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // 1. Search for podcasts
    const searchRes = await fetch(TADDY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': TADDY_API_KEY,
        'X-USER-ID': TADDY_USER_ID,
      },
      body: JSON.stringify({
        query: `
          query SearchPodcasts($term: String!) {
            search(term: $term, filterForTypes: PODCASTSERIES, limitPerPage: 10) {
              searchId
              podcastSeries {
                uuid
                name
                description
                imageUrl
              }
            }
          }
        `,
        variables: { term: q },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error('Taddy API error', searchRes.status, errorText);
      return NextResponse.json({ error: `Taddy API error: ${searchRes.status}` }, { status: 502 });
    }

    const searchData: TaddySearchResult = await searchRes.json();
    console.log('Taddy search response:', JSON.stringify(searchData, null, 2));

    if (searchData.errors) {
      console.error('Taddy GraphQL errors:', searchData.errors);
      return NextResponse.json({ error: 'Taddy GraphQL error' }, { status: 502 });
    }

    const series = searchData.data?.search?.podcastSeries || [];
    console.log(`Found ${series.length} podcast series`);

    // 2. Get latest episodes for each series
    const episodesPromises = series.map(async (show: TaddyPodcastSeries) => {
      const episodesRes = await fetch(TADDY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': TADDY_API_KEY,
          'X-USER-ID': TADDY_USER_ID,
        },
        body: JSON.stringify({
          query: `
            query GetLatestEpisodes($uuid: ID!) {
              getPodcastSeries(uuid: $uuid) {
                uuid
                episodes(limitPerPage: 5, sortOrder: PUBLISHED_DESC) {
                  uuid
                  name
                  description
                  audioUrl
                  duration
                }
              }
            }
          `,
          variables: { uuid: show.uuid },
        }),
      });

      if (!episodesRes.ok) {
        console.error('Failed to fetch episodes for', show.uuid, episodesRes.status);
        return [];
      }

      const episodesData: TaddyEpisodesResult = await episodesRes.json();
      console.log(`Episodes data for ${show.name}:`, JSON.stringify(episodesData, null, 2));

      const episodes = episodesData.data?.getPodcastSeries?.episodes || [];
      return episodes.map((ep) => ({
        uuid: ep.uuid,
        name: ep.name,
        description: ep.description,
        audioUrl: ep.audioUrl,
        duration: ep.duration,
        podcastTitle: show.name,
        thumbnail: show.imageUrl,
      }));
    });

    const allEpisodesArrays = await Promise.all(episodesPromises);
    const allEpisodes = allEpisodesArrays.flat();
    console.log(`Total episodes fetched: ${allEpisodes.length}`);

    return NextResponse.json({ episodes: allEpisodes });
  } catch (error: unknown) {
    clearTimeout(timeout);
    const err = error as Error;
    if (err.name === 'AbortError') {
      console.error('Taddy API timeout');
      return NextResponse.json({ error: 'Taddy API request timed out' }, { status: 504 });
    }
    console.error('Taddy API error:', err);
    return NextResponse.json({ error: 'Taddy API failed' }, { status: 500 });
  }
}