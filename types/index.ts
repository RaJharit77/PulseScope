export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    statistics: { viewCount: string };
    url: string;
}

export interface SpotifyTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    thumbnail: string;
    popularity: number;
    previewUrl: string | null;
    spotifyUrl: string;
}

export interface SpotifyEpisode {
    id: string;
    title: string;
    description: string;
    podcastTitle: string;
    audioUrl: string | null;
    thumbnail: string;
    duration: number;
    spotifyUrl: string;
}

export interface TaddyEpisode {
    id: string;
    title: string;
    description: string;
    podcastTitle: string;
    audioUrl: string;
    thumbnail: string;
    duration: number;
}

export interface RedditPost {
    id: string;
    title: string;
    subreddit: string;
    score: number;
    num_comments: number;
    url: string;
    created: number;
}

export interface Podcast {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;  
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export type Session = {
    user: User;
    expires: string;
};