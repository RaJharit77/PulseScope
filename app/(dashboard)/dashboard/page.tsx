import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getYouTubeTrending, getTaddyTrendingPodcasts } from '@/services/trending';
import { getTrendingHackerNews } from '@/services/hackernews';
import StatsCards from '@/components/dashboard/StatsCards';
import PieChartStats from '@/components/dashboard/PieChartStats';
import BarChartStats from '@/components/dashboard/BarChartStats';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import HackerNewsFeed from '@/components/feeds/HackerNewsFeed';
import { BarChart3, PieChart, TrendingUp, Video, Radio, Globe } from 'lucide-react';

type YouTubeTrendVideo = NonNullable<Awaited<ReturnType<typeof getYouTubeTrending>>>[number];
type TaddyTrendEpisode = NonNullable<Awaited<ReturnType<typeof getTaddyTrendingPodcasts>>>[number];
type HackerNewsPost = NonNullable<Awaited<ReturnType<typeof getTrendingHackerNews>>>[number];

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/auth/signin');

    const [youtubeVideos, taddyPodcasts, hackerNewsPosts] = await Promise.all([
        getYouTubeTrending(10),
        getTaddyTrendingPodcasts(),
        getTrendingHackerNews(),
    ]);

    const categoryCounts: Record<string, number> = {};
    youtubeVideos.forEach((video: YouTubeTrendVideo) => {
        const title = video.title.toLowerCase();
        if (title.includes('music') || title.includes('musique') || title.includes('clip')) {
            categoryCounts['Musique'] = (categoryCounts['Musique'] || 0) + 1;
        } else if (title.includes('gaming') || title.includes('jeu') || title.includes('game')) {
            categoryCounts['Gaming'] = (categoryCounts['Gaming'] || 0) + 1;
        } else if (title.includes('sport') || title.includes('foot') || title.includes('ball')) {
            categoryCounts['Sport'] = (categoryCounts['Sport'] || 0) + 1;
        } else if (title.includes('news') || title.includes('actu') || title.includes('info')) {
            categoryCounts['Actualités'] = (categoryCounts['Actualités'] || 0) + 1;
        } else {
            categoryCounts['Autres'] = (categoryCounts['Autres'] || 0) + 1;
        }
    });

    const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
        color:
            name === 'Musique' ? '#1DB954' :
                name === 'Gaming' ? '#FF4655' :
                    name === 'Sport' ? '#FFA500' :
                        name === 'Actualités' ? '#3B82F6' :
                            '#6C63FF',
    }));

    const barData = [
        {
            name: 'Contenu',
            'YouTube': youtubeVideos.length,
            'Hacker News': hackerNewsPosts.length,
            'Podcasts Taddy': taddyPodcasts.length,
        },
    ];

    return (
        <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
            {/* En-tête */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Tableau de bord
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                    Aperçu en temps réel des tendances de toutes les sources.
                </p>
            </div>

            {/* Cartes de statistiques */}
            <StatsCards
                youtubeCount={youtubeVideos.length}
                hackerNewsCount={hackerNewsPosts.length}
                taddyCount={taddyPodcasts.length}
            />

            {/* Graphiques */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary" />
                        Répartition des tendances YouTube
                    </h2>
                    <PieChartStats title="" data={pieData} />
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-secondary" />
                        Volume de contenu par source
                    </h2>
                    <BarChartStats
                        title=""
                        data={barData}
                        bars={[
                            { key: 'YouTube', color: '#FF0000', name: 'YouTube' },
                            { key: 'Hacker News', color: '#FF6600', name: 'Hacker News' },
                            { key: 'Podcasts Taddy', color: '#8B5CF6', name: 'Podcasts Taddy' },
                        ]}
                    />
                </div>
            </div>

            {/* Aperçu rapide */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Dernières tendances
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* YouTube */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-red-400">
                            <Video className="w-4 h-4" /> YouTube
                        </h3>
                        <div className="space-y-3">
                            {youtubeVideos.slice(0, 3).map((video: YouTubeTrendVideo) => (
                                <div key={video.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30 transition">
                                    <p className="font-medium truncate text-sm text-gray-200">{video.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{video.channelTitle}</p>
                                    <p className="text-xs text-gray-500">
                                        {parseInt(video.statistics?.viewCount || '0').toLocaleString()} vues
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hacker News */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-orange-400">
                            <Globe className="w-4 h-4" /> Hacker News
                        </h3>
                        <div className="space-y-3">
                            {hackerNewsPosts.slice(0, 3).map((post: HackerNewsPost) => (
                                <div key={post.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-orange-500/30 transition">
                                    <p className="font-medium truncate text-sm text-gray-200">{post.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>{post.points} points</span>
                                        <span>{post.comments} commentaires</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Podcasts */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-purple-400">
                            <Radio className="w-4 h-4" /> Podcasts
                        </h3>
                        <div className="space-y-3">
                            {taddyPodcasts.slice(0, 3).map((podcast: TaddyTrendEpisode) => (
                                <div key={podcast.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-purple-500/30 transition">
                                    <p className="font-medium truncate text-sm text-gray-200">{podcast.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{podcast.podcastTitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Flux complets */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Détail des tendances
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <YouTubeFeed videos={youtubeVideos} />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <HackerNewsFeed posts={hackerNewsPosts} />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
                        <TaddyPodcastFeed episodes={taddyPodcasts} />
                    </div>
                </div>
            </div>
        </div>
    );
}