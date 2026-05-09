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
import {
    Video,
    Newspaper,
    Podcast,
    X,
    Sparkles,
    ArrowRight,
    Lock,
} from 'lucide-react';
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
        <div className="min-h-screen">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
                <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 md:pt-24 md:pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                            Testez nos APIs
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-4">
                            Comparez les résultats en direct de YouTube, Hacker News et les podcasts.
                        </p>
                        <p className="text-gray-400 text-sm md:text-base mb-8">
                            {session
                                ? 'Toutes les sources sont disponibles pour votre recherche.'
                                : `Mode invité : YouTube uniquement – ${MAX_SEARCHES - searchCount} recherche(s) restante(s).`}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto"
                    >
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                    </motion.div>

                    <AnimatePresence>
                        {limitReached && !session && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 text-center"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-gray-300">
                                    <Lock className="w-5 h-5 text-amber-400" />
                                    <span>
                                        Limite atteinte.{' '}
                                        <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                                            Connectez‑vous
                                        </Link>{' '}
                                        pour débloquer toutes les sources.
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                <AnimatePresence>
                    {showNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="relative mx-auto max-w-xl mb-4 flex items-center gap-3 p-4 bg-orange-500/10 backdrop-blur-sm border border-orange-500/30 rounded-2xl text-orange-200 text-sm shadow-lg"
                        >
                            <Newspaper className="w-5 h-5 shrink-0" />
                            <span className="flex-1">
                                Hacker News est maintenant disponible pour les utilisateurs connectés !
                            </span>
                            <button
                                onClick={() => setShowNotice(false)}
                                className="p-0.5 rounded-full hover:bg-orange-500/20 transition"
                                aria-label="Fermer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center py-20"
                        >
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    ) : results ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-8 pb-16"
                        >
                            {keyword && (
                                <h2 className="text-2xl font-semibold text-center mb-8">
                                    Résultats pour{' '}
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {keyword}
                                    </span>
                                </h2>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {results.youtube?.length ? (
                                        <motion.section
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
                                        >
                                            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-4">
                                                <Video className="w-5 h-5" /> YouTube
                                            </h3>
                                            <YouTubeFeed videos={results.youtube} />
                                        </motion.section>
                                    ) : searched ? (
                                        <EmptyPlaceholder icon={<Video className="w-6 h-6" />} />
                                    ) : null}
                                </AnimatePresence>

                                {session && (
                                    <AnimatePresence>
                                        {results.hackernews?.length ? (
                                            <motion.section
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
                                            >
                                                <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-400 mb-4">
                                                    <Newspaper className="w-5 h-5" /> Hacker News
                                                </h3>
                                                <HackerNewsFeed posts={results.hackernews} />
                                            </motion.section>
                                        ) : searched ? (
                                            <EmptyPlaceholder icon={<Newspaper className="w-6 h-6" />} />
                                        ) : null}
                                    </AnimatePresence>
                                )}

                                {session && (
                                    <AnimatePresence>
                                        {results.taddy?.length ? (
                                            <motion.section
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
                                            >
                                                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-400 mb-4">
                                                    <Podcast className="w-5 h-5" /> Podcasts
                                                </h3>
                                                <TaddyPodcastFeed episodes={results.taddy} />
                                            </motion.section>
                                        ) : searched ? (
                                            <EmptyPlaceholder icon={<Podcast className="w-6 h-6" />} />
                                        ) : null}
                                    </AnimatePresence>
                                )}
                            </div>

                            {!results.youtube?.length && !results.hackernews?.length && !results.taddy?.length && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                                >
                                    <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Aucun résultat trouvé pour « {keyword} ».</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : searched ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-20 text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                        >
                            <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Aucun résultat trouvé.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-20 text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                                <ArrowRight className="w-10 h-10 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-lg">Prêt à tester nos APIs ?</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Saisissez un mot‑clé pour comparer les résultats de toutes les sources.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyPlaceholder({ icon }: { icon: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col items-center justify-center h-full min-h-[120px]"
        >
            <div className="text-gray-500 mb-2">{icon}</div>
            <p className="text-gray-500 text-sm">Aucun résultat</p>
        </motion.div>
    );
}