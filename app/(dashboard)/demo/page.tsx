'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SearchBar from '@/components/dashboard/SearchBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import { searchYouTube } from '@/services/youtube';
import { Sparkles, Video, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            if (!session) setSearchCount(prev => prev + 1);
        } catch (err) {
            console.error(err);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 md:pt-24 md:pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                            Essayez PulseScope gratuitement
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-4">
                            Découvrez la puissance de notre moteur de recherche de tendances.
                        </p>
                        <p className="text-gray-400 text-sm md:text-base mb-8">
                            Recherchez n&apos;importe quel mot‑clé et visualisez jusqu&apos;à 5 vidéos YouTube.
                            <br />
                            {!session && (
                                <span className="text-primary/80">
                                    Mode invité : {MAX_SEARCHES - searchCount} recherche(s) restante(s).
                                </span>
                            )}
                        </p>
                    </motion.div>

                    {/* Search Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto"
                    >
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                    </motion.div>

                    {/* Limit reached message */}
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
                                        pour continuer.
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 md:px-8 pb-16">
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
                    ) : videos.length > 0 ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Video className="w-6 h-6 text-red-400" />
                                <h2 className="text-xl font-semibold text-gray-200">
                                    Résultats ({videos.length})
                                </h2>
                            </div>
                            <YouTubeFeed videos={videos} />
                        </motion.div>
                    ) : searched ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-20 text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                        >
                            <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Aucune vidéo trouvée pour cette recherche.</p>
                            <p className="text-gray-500 text-sm mt-2">Essayez un autre mot‑clé.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-20 text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                                <ArrowRight className="w-10 h-10 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-lg">Prêt à explorer ?</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Saisissez un mot‑clé dans la barre de recherche ci‑dessus.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}