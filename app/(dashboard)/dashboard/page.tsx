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
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tableau de bord
            </h1>

            <StatsCards
                youtubeCount={youtubeVideos.length}
                hackerNewsCount={hackerNewsPosts.length}
                taddyCount={taddyPodcasts.length}
            />

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PieChartStats title="Répartition des tendances YouTube" data={pieData} />
                <BarChartStats
                    title="Volume de contenu par source"
                    data={barData}
                    bars={[
                        { key: 'YouTube', color: '#FF0000', name: 'YouTube' },
                        { key: 'Hacker News', color: '#FF6600', name: 'Hacker News' },
                        { key: 'Podcasts Taddy', color: '#8B5CF6', name: 'Podcasts Taddy' },
                    ]}
                />
            </div>

            <div className="mt-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Aperçu des dernières tendances
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-400">🔥 YouTube</h3>
                        <div className="space-y-2">
                            {youtubeVideos.slice(0, 3).map((video: YouTubeTrendVideo) => (
                                <div key={video.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="font-medium truncate text-sm">{video.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{video.channelTitle}</p>
                                    <p className="text-xs text-gray-500">
                                        {parseInt(video.statistics?.viewCount || '0').toLocaleString()} vues
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-orange-400">💡 Hacker News</h3>
                        <div className="space-y-2">
                            {hackerNewsPosts.slice(0, 3).map((post: HackerNewsPost) => (
                                <div key={post.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="font-medium truncate text-sm">{post.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>{post.points} points</span>
                                        <span>{post.comments} commentaires</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">🎙️ Podcasts</h3>
                        <div className="space-y-2">
                            {taddyPodcasts.slice(0, 3).map((podcast: TaddyTrendEpisode) => (
                                <div key={podcast.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="font-medium truncate text-sm">{podcast.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{podcast.podcastTitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Détail des tendances
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                        <YouTubeFeed videos={youtubeVideos} />
                    </div>
                    <div>
                        <HackerNewsFeed posts={hackerNewsPosts} />
                    </div>
                    <div>
                        <TaddyPodcastFeed episodes={taddyPodcasts} />
                    </div>
                </div>
            </div>
        </div>
    );
}