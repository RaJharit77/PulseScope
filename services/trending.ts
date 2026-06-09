import axios from 'axios';

interface YouTubeVideoItem {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
        channelTitle: string;
        publishedAt: string;
    };
    statistics: {
        viewCount?: string;
        likeCount?: string;
    };
}

/*interface SpotifyArtist {
    name: string;
}

interface SpotifyAlbum {
    name: string;
    images: { url: string }[];
}

interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    popularity: number;
    preview_url: string | null;
    external_urls: { spotify: string };
}

interface SpotifyPlaylistItem {
    track: SpotifyTrack;
}*/

interface TaddyEpisodeNode {
    uuid: string;
    name: string;
    description: string;
    audioUrl: string;
    duration: number;
}

interface TaddyEpisodeEdge {
    node: TaddyEpisodeNode;
}

interface TaddyPodcastSeries {
    uuid: string;
    name: string;
    description: string;
    imageUrl: string;
    episodes: {
        edges: TaddyEpisodeEdge[];
    };
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
/*const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;*/
const TADDY_API_KEY = process.env.TADDY_API_KEY!;
const TADDY_USER_ID = process.env.TADDY_USER_ID!;

export async function getYouTubeTrending(maxResults = 10) {
    try {
        const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics',
                chart: 'mostPopular',
                regionCode: 'FR',
                maxResults,
                key: YOUTUBE_API_KEY,
            },
        });
        return res.data.items.map((item: YouTubeVideoItem) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            statistics: {
                viewCount: item.statistics.viewCount || '0',
                likeCount: item.statistics.likeCount || '0',
            },
            url: `https://www.youtube.com/watch?v=${item.id}`,
        }));
    } catch (error) {
        console.error('YouTube trending error:', error);
        return [];
    }
}

/*async function getSpotifyAccessToken() {
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
    return data.access_token;
}

export async function getSpotifyTopTracks(limit = 10) {
    try {
        const token = await getSpotifyAccessToken();
        const res = await fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbIPWwFssbupI/tracks?limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        return data.items.map((item: SpotifyPlaylistItem) => ({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map((a: SpotifyArtist) => a.name).join(', '),
            album: item.track.album.name,
            thumbnail: item.track.album.images[0]?.url,
            popularity: item.track.popularity,
            previewUrl: item.track.preview_url,
            spotifyUrl: item.track.external_urls.spotify,
        }));
    } catch (error) {
        console.error('Spotify top tracks error:', error);
        return [];
    }
}*/

export async function getTaddyTrendingPodcasts(limit = 10) {
    try {
        const res = await fetch('https://api.taddy.org/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': TADDY_API_KEY,
                'X-USER-ID': TADDY_USER_ID,
            },
            body: JSON.stringify({
                query: `
        query Search($term: String!, $first: Int!) {
            search(term: $term, first: $first) {
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
                variables: { term: 'trending', first: limit },
            }),
        });

        const data = await res.json();
        const series = data.data?.search?.podcastSeries || [];
        return series.flatMap((show: TaddyPodcastSeries) =>
            show.episodes.edges.map((edge: TaddyEpisodeEdge) => ({
                id: edge.node.uuid,
                title: edge.node.name,
                description: edge.node.description,
                podcastTitle: show.name,
                audioUrl: edge.node.audioUrl,
                thumbnail: show.imageUrl,
                duration: edge.node.duration,
            }))
        );
    } catch (error) {
        console.error('Taddy trending error:', error);
        return [];
    }
}