'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SearchBar from '@/components/dashboard/SearchBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import HackerNewsFeed from '@/components/feeds/HackerNewsFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import { searchYouTube } from '@/services/youtube';
import { searchTaddyPodcasts } from '@/services/taddy';
import { searchHackerNews } from '@/services/hackernews';
import { Podcast, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type YouTubeVideos = Awaited<ReturnType<typeof searchYouTube>>;
type HackerNewsPosts = Awaited<ReturnType<typeof searchHackerNews>>;
type TaddyPodcasts = Awaited<ReturnType<typeof searchTaddyPodcasts>>;

interface SearchResults {
    youtube?: YouTubeVideos;
    hackernews?: HackerNewsPosts;
    taddy?: TaddyPodcasts;
}

export default function TestPage() {
    const { data: session } = useSession();
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchCount, setSearchCount] = useState(0);

    const [showNotice, setShowNotice] = useState(true);

    const MAX_SEARCHES = 3;
    const limitReached = !session && searchCount >= MAX_SEARCHES;

    useEffect(() => {
        if (!showNotice) return;
        const timer = setTimeout(() => setShowNotice(false), 6000);
        return () => clearTimeout(timer);
    }, [showNotice]);

    const handleSearch = async (query: string) => {
        if (!query || limitReached) return;
        setKeyword(query);
        setLoading(true);
        setSearched(true);
        try {
            if (session) {
                const [youtube, hackernews, taddy] = await Promise.all([
                    searchYouTube(query),
                    searchHackerNews(query),
                    searchTaddyPodcasts(query),
                ]);
                setResults({ youtube, hackernews, taddy });
            } else {
                const youtube = await searchYouTube(query);
                setResults({ youtube });
                setSearchCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
            setResults({});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Tester Pulse
                </h1>
                <p className="text-gray-400 mt-2">
                    {session
                        ? 'Recherchez un terme pour voir les résultats en direct depuis YouTube, Hacker News et les podcasts Taddy.'
                        : 'Recherchez un terme pour voir les résultats YouTube (version invité).'}
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

            <AnimatePresence>
                {showNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="relative mx-auto max-w-xl mb-4 flex items-center gap-2 p-3 bg-orange-500/10 backdrop-blur-sm border border-orange-500/30 rounded-xl text-orange-200 text-sm shadow-lg"
                    >
                        <span className="flex-1">
                            Nouveau : Hacker News est désormais disponible pour les utilisateurs connectés !
                        </span>
                        <button
                            onClick={() => setShowNotice(false)}
                            className="p-0.5 rounded-full hover:bg-orange-500/20 transition"
                            aria-label="Fermer la notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {limitReached ? (
                <div className="text-center py-16 text-gray-400">
                    Vous avez effectué {MAX_SEARCHES} recherches en mode invité.
                    <br />
                    <Link href="/auth/signin" className="text-primary hover:underline mt-2 inline-block">
                        Connectez-vous
                    </Link>{' '}
                    pour accéder à toutes les sources et à des recherches illimitées.
                </div>
            ) : (
                <>
                    <SearchBar onSearch={handleSearch} isLoading={loading} />

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : results ? (
                        <div className="mt-8 space-y-12">
                            {keyword && (
                                <h2 className="text-2xl font-semibold text-center">
                                    Résultats pour{' '}
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {keyword}
                                    </span>
                                </h2>
                            )}

                            <div className={`grid grid-cols-1 ${session ? 'lg:grid-cols-2 xl:grid-cols-3' : ''} gap-8`}>
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                                        Vidéos YouTube
                                    </h3>
                                    {results.youtube?.length ? (
                                        <YouTubeFeed videos={results.youtube} />
                                    ) : (
                                        <EmptyPlaceholder />
                                    )}
                                </section>

                                {session && (
                                    <section>
                                        <h3 className="text-xl font-semibold mb-4 text-orange-400 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full" />
                                            Hacker News
                                        </h3>
                                        {results.hackernews?.length ? (
                                            <HackerNewsFeed posts={results.hackernews} />
                                        ) : (
                                            <EmptyPlaceholder />
                                        )}
                                    </section>
                                )}

                                {session && (
                                    <section>
                                        <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                                            <Podcast className="w-5 h-5" />
                                            Podcasts Taddy
                                        </h3>
                                        {results.taddy?.length ? (
                                            <TaddyPodcastFeed episodes={results.taddy} />
                                        ) : (
                                            <EmptyPlaceholder />
                                        )}
                                    </section>
                                )}
                            </div>
                        </div>
                    ) : searched ? (
                        <div className="text-center py-16 text-gray-400">Aucun résultat trouvé.</div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p>Sélectionnez un sujet ou utilisez la barre de recherche pour comparer les sources.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function EmptyPlaceholder() {
    return (
        <div className="flex items-center justify-center h-32 bg-white/5 rounded-lg border border-white/10 text-gray-500">
            Aucun résultat
        </div>
    );
}