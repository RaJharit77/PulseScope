'use client';

import { useState } from 'react';
import SearchBar from '@/components/dashboard/SearchBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import { searchYouTube } from '@/services/youtube';

export default function DemoPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (keyword: string) => {
        setLoading(true);
        const results = await searchYouTube(keyword);
        setVideos(results.slice(0, 5));
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Démo PulseScope</h1>
            <p className="text-gray-400 mb-8">Essayez une recherche (résultats limités à 5 vidéos).</p>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
            <div className="mt-8">
                <YouTubeFeed videos={videos} />
            </div>
        </div>
    );
}