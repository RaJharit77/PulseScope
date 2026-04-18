interface SpotifyEpisode {
    id: string;
    name: string;
    description: string;
    show: { name: string };
    audio_preview_url: string;
    images: Array<{ url: string }>;
    duration_ms: number;
    external_urls: { spotify: string };
}

interface SpotifyEpisodeSearchResult {
    episodes?: { items: SpotifyEpisode[] };
}

interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    popularity: number;
    preview_url: string;
    external_urls: { spotify: string };
}

interface SpotifyTrackSearchResult {
    tracks?: { items: SpotifyTrack[] };
}

export async function searchSpotifyPodcasts(keyword: string) {
    const res = await fetch(`/api/spotify?type=episode&q=${encodeURIComponent(keyword)}`);
    const data = await res.json() as SpotifyEpisodeSearchResult;
    return data.episodes?.items.map((episode) => ({
        id: episode.id,
        title: episode.name,
        description: episode.description,
        podcastTitle: episode.show.name,
        audioUrl: episode.audio_preview_url,
        thumbnail: episode.images[0]?.url,
        duration: episode.duration_ms / 1000,
        spotifyUrl: episode.external_urls.spotify,
    })) || [];
}

export async function searchSpotifyTracks(keyword: string) {
    const res = await fetch(`/api/spotify?type=track&q=${encodeURIComponent(keyword)}`);
    const data = await res.json() as SpotifyTrackSearchResult;
    return data.tracks?.items.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        thumbnail: track.album.images[0]?.url,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
    })) || [];
}



/*
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

let spotifyApi: SpotifyApi | null = null;

async function getSpotifyClient() {
    if (spotifyApi) return spotifyApi;

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const tokenData = await response.json();

    spotifyApi = SpotifyApi.withAccessToken(clientId, tokenData);
    return spotifyApi;
}

export async function searchSpotifyPodcasts(keyword: string) {
    try {
        const api = await getSpotifyClient();
        const result = await api.search(keyword, ['episode'], undefined, 20);

        return result.episodes.items.map(episode => ({
            id: episode.id,
            title: episode.name,
            description: episode.description,
            podcastTitle: '', // SimplifiedEpisode doesn't include show info; fetch separately if needed
            audioUrl: episode.audio_preview_url,
            thumbnail: episode.images[0]?.url,
            duration: episode.duration_ms / 1000,
            releaseDate: episode.release_date,
            spotifyUrl: episode.external_urls.spotify,
        }));
    } catch (error) {
        console.error('Spotify API error:', error);
        return [];
    }
}

export async function searchSpotifyTracks(keyword: string) {
    try {
        const api = await getSpotifyClient();
        const result = await api.search(keyword, ['track'], undefined, 20);

        return result.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            thumbnail: track.album.images[0]?.url,
            duration: track.duration_ms / 1000,
            popularity: track.popularity,
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
        }));
    } catch (error) {
        console.error('Spotify API error:', error);
        return [];
    }
}*/