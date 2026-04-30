'use client';

import { useState, useEffect } from 'react';
import { getYouTubeTrending, getTaddyTrendingPodcasts } from '@/services/trending';
import { getNewReleases } from '@/services/youtube';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import { Loader2, Sparkles, TrendingUp, Calendar } from 'lucide-react';

type FilterPeriod = 'today' | 'week' | 'month';

type YouTubeTrendVideo = NonNullable<Awaited<ReturnType<typeof getYouTubeTrending>>>[number];
type YouTubeNewRelease = NonNullable<Awaited<ReturnType<typeof getNewReleases>>>[number];
type TaddyTrendEpisode = NonNullable<Awaited<ReturnType<typeof getTaddyTrendingPodcasts>>>[number];

export default function TrendsPage() {
    const [filter, setFilter] = useState<FilterPeriod>('today');
    const [youtubeTrending, setYoutubeTrending] = useState<YouTubeTrendVideo[]>([]);
    const [youtubeNew, setYoutubeNew] = useState<YouTubeNewRelease[]>([]);
    const [taddyPodcasts, setTaddyPodcasts] = useState<TaddyTrendEpisode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [youtubeData, taddyData] = await Promise.all([
                    getYouTubeTrending(filter === 'today' ? 10 : filter === 'week' ? 15 : 20),
                    getTaddyTrendingPodcasts(filter === 'today' ? 5 : filter === 'week' ? 10 : 15),
                ]);
                setYoutubeTrending(youtubeData);
                setTaddyPodcasts(taddyData);

                const newReleases = await getNewReleases();
                setYoutubeNew(newReleases);
            } catch (error) {
                console.error('Error fetching trends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    const filters: { key: FilterPeriod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { key: 'today', label: "Aujourd'hui", icon: Calendar },
        { key: 'week', label: 'Cette semaine', icon: TrendingUp },
        { key: 'month', label: 'Ce mois', icon: Sparkles },
    ];

    return (
        <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Tendances & Nouveautés
                </h1>
                <p className="text-gray-400">
                    Découvrez ce qui est populaire en ce moment sur YouTube et les podcasts.
                </p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
                {filters.map((f) => {
                    const Icon = f.icon;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center gap-2 ${filter === f.key
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-500 text-gray-300 hover:border-white'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {f.label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Vidéos tendance – {filter === 'today' ? "Aujourd'hui" : filter === 'week' ? 'Cette semaine' : 'Ce mois'}
                        </h2>
                        {youtubeTrending.length > 0 ? (
                            <YouTubeFeed videos={youtubeTrending} />
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                                Aucune tendance trouvée.
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" />
                            Nouveautés YouTube
                        </h2>
                        {youtubeNew.length > 0 ? (
                            <YouTubeFeed videos={youtubeNew} />
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                                Aucune nouveauté trouvée.
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" />
                            Podcasts populaires
                        </h2>
                        {taddyPodcasts.length > 0 ? (
                            <TaddyPodcastFeed episodes={taddyPodcasts} />
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                                Aucun podcast trouvé.
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}