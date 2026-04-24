'use client';

import { useState } from 'react';
import SearchBar from '@/components/dashboard/SearchBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import SpotifyTrackFeed from '@/components/feeds/SpotifyTrackFeed';
import SpotifyPodcastFeed from '@/components/feeds/SpotifyPodcastFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import { searchYouTube } from '@/services/youtube';
import { searchSpotifyTracks, searchSpotifyPodcasts } from '@/services/spotify';
import { searchTaddyPodcasts } from '@/services/taddy';

type YouTubeVideos = Awaited<ReturnType<typeof searchYouTube>>;
type SpotifyTracks = Awaited<ReturnType<typeof searchSpotifyTracks>>;
type SpotifyPodcasts = Awaited<ReturnType<typeof searchSpotifyPodcasts>>;
type TaddyPodcasts = Awaited<ReturnType<typeof searchTaddyPodcasts>>;

interface SearchResults {
    youtube: YouTubeVideos;
    spotifyTracks: SpotifyTracks;
    spotifyPodcasts: SpotifyPodcasts;
    taddy: TaddyPodcasts;
}

export default function TestPage() {
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (keyword: string) => {
        setLoading(true);
        const [youtube, spotifyTracks, spotifyPodcasts, taddy] = await Promise.all([
            searchYouTube(keyword),
            searchSpotifyTracks(keyword),
            searchSpotifyPodcasts(keyword),
            searchTaddyPodcasts(keyword),
        ]);
        setResults({ youtube, spotifyTracks, spotifyPodcasts, taddy });
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Test des APIs</h1>
            <p className="text-gray-400 mb-8">Recherchez un terme pour voir les résultats de toutes les sources.</p>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
            {results && (
                <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <YouTubeFeed videos={results.youtube} />
                    <SpotifyTrackFeed tracks={results.spotifyTracks} />
                    <SpotifyPodcastFeed episodes={results.spotifyPodcasts} />
                    <TaddyPodcastFeed episodes={results.taddy} />
                </div>
            )}
        </div>
    );
}