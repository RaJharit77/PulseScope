import { SpotifyApi } from '@spotify/web-api-ts-sdk';

let spotifyApi: SpotifyApi | null = null;

async function getSpotifyClient() {
    if (spotifyApi) return spotifyApi;

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    // Client Credentials flow - accès public aux podcasts
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
}