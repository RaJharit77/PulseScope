'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SearchBar from '@/components/dashboard/SearchBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import { searchYouTube } from '@/services/youtube';

export default function DemoPage() {
    const { data: session } = useSession();
    const [videos, setVideos] = useState<Awaited<ReturnType<typeof searchYouTube>>>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchCount, setSearchCount] = useState(0);

    const MAX_SEARCHES = 3;
    const limitReached = !session && searchCount >= MAX_SEARCHES;

    const handleSearch = async (keyword: string) => {
        if (limitReached) return;

        setLoading(true);
        setSearched(true);
        try {
            const results = await searchYouTube(keyword);
            setVideos(results.slice(0, 5));
            if (!session) {
                setSearchCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Démo Pulse
                </h1>
                <p className="text-gray-400 mt-2">
                    Essayez une recherche (résultats limités à 5 vidéos YouTube).
                </p>
                {!session && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <span>
                            {limitReached
                                ? 'Limite de recherches atteinte.'
                                : `Recherches restantes : ${MAX_SEARCHES - searchCount}`}
                        </span>
                        {limitReached && (
                            <Link href="/auth/signin" className="text-primary hover:underline">
                                Connectez-vous pour continuer
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {limitReached ? (
                <div className="text-center py-16 text-gray-400">
                    Vous avez effectué {MAX_SEARCHES} recherches en mode invité.
                    <br />
                    <Link href="/auth/signin" className="text-primary hover:underline mt-2 inline-block">
                        Créez un compte ou connectez-vous
                    </Link>{' '}
                    pour un accès illimité.
                </div>
            ) : (
                <>
                    <SearchBar onSearch={handleSearch} isLoading={loading} />

                    <div className="mt-8">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : videos.length > 0 ? (
                            <YouTubeFeed videos={videos} />
                        ) : searched ? (
                            <div className="text-center py-16 text-gray-400">
                                Aucune vidéo trouvée pour cette recherche.
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                Utilisez la barre de recherche pour découvrir des vidéos tendances.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}