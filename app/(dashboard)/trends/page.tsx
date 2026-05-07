'use client';

import { useState, useEffect } from 'react';
import { getYouTubeTrending, getTaddyTrendingPodcasts } from '@/services/trending';
import { getNewReleases } from '@/services/youtube';
import { getTrendingHackerNews } from '@/services/hackernews';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import HackerNewsFeed from '@/components/feeds/HackerNewsFeed';
import { Loader2, Sparkles, TrendingUp, Calendar, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FilterPeriod = 'today' | 'week' | 'month';

type YouTubeTrendVideo = NonNullable<Awaited<ReturnType<typeof getYouTubeTrending>>>[number];
type YouTubeNewRelease = NonNullable<Awaited<ReturnType<typeof getNewReleases>>>[number];
type TaddyTrendEpisode = NonNullable<Awaited<ReturnType<typeof getTaddyTrendingPodcasts>>>[number];
type HackerNewsPost = NonNullable<Awaited<ReturnType<typeof getTrendingHackerNews>>>[number];

const AVAILABLE_SOURCES = {
  youtube_trending: { label: 'YouTube tendance', color: 'red', icon: TrendingUp },
  youtube_new: { label: 'Nouveautés YouTube', color: 'blue', icon: Sparkles },
  hackernews: { label: 'Hacker News', color: 'orange', icon: TrendingUp },
  taddy: { label: 'Podcasts populaires', color: 'purple', icon: Sparkles },
} as const;

type SourceKey = keyof typeof AVAILABLE_SOURCES;

export default function TrendsPage() {
  const [period, setPeriod] = useState<FilterPeriod>('today');
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<{
    youtubeTrending: YouTubeTrendVideo[];
    youtubeNew: YouTubeNewRelease[];
    hackernews: HackerNewsPost[];
    taddy: TaddyTrendEpisode[];
  }>({
    youtubeTrending: [],
    youtubeNew: [],
    hackernews: [],
    taddy: [],
  });
  const [activeFilters, setActiveFilters] = useState<SourceKey[]>(
    Object.keys(AVAILABLE_SOURCES) as SourceKey[]
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ytTrending, ytNew, hn, taddy] = await Promise.all([
          getYouTubeTrending(period === 'today' ? 10 : period === 'week' ? 15 : 20),
          getNewReleases(),
          getTrendingHackerNews(),
          getTaddyTrendingPodcasts(period === 'today' ? 5 : period === 'week' ? 10 : 15),
        ]);
        setAllData({ youtubeTrending: ytTrending, youtubeNew: ytNew, hackernews: hn, taddy });
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [period]);

  const toggleFilter = (key: SourceKey) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const selectAll = () => setActiveFilters(Object.keys(AVAILABLE_SOURCES) as SourceKey[]);
  const clearAll = () => setActiveFilters([]);

  const filters = [
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
          Explorez les contenus les plus populaires de toutes nos sources.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {filters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={() => setPeriod(f.key as FilterPeriod)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center gap-2 ${period === f.key
                ? 'bg-primary text-white border-primary'
                : 'border-gray-500 text-gray-300 hover:border-white'
                }`}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-full border border-gray-500 text-sm font-medium text-gray-300 hover:border-white transition flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Sources ({activeFilters.length}/{Object.keys(AVAILABLE_SOURCES).length})
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-wrap gap-2 items-center justify-center">
              {Object.entries(AVAILABLE_SOURCES).map(([key, src]) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key as SourceKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${activeFilters.includes(key as SourceKey)
                    ? `bg-${src.color}-500/20 border-${src.color}-500/50 text-${src.color}-300`
                    : 'border-gray-600 text-gray-400 hover:border-white'
                    }`}
                >
                  <src.icon className="w-3.5 h-3.5" />
                  {src.label}
                  {activeFilters.includes(key as SourceKey) && (
                    <X className="w-3 h-3 ml-1 hover:text-white" onClick={(e) => { e.stopPropagation(); toggleFilter(key as SourceKey); }} />
                  )}
                </button>
              ))}
              <div className="flex gap-1 ml-2">
                <button onClick={selectAll} className="text-xs text-primary hover:underline">Tout</button>
                <button onClick={clearAll} className="text-xs text-gray-400 hover:underline">Aucun</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-12">
          {activeFilters.includes('youtube_trending') && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Vidéos tendance – {period === 'today' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : 'Ce mois'}
              </h2>
              {allData.youtubeTrending.length > 0 ? (
                <YouTubeFeed videos={allData.youtubeTrending} />
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                  Aucune tendance trouvée.
                </div>
              )}
            </section>
          )}

          {activeFilters.includes('youtube_new') && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Nouveautés YouTube
              </h2>
              {allData.youtubeNew.length > 0 ? (
                <YouTubeFeed videos={allData.youtubeNew} />
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                  Aucune nouveauté trouvée.
                </div>
              )}
            </section>
          )}

          {activeFilters.includes('hackernews') && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Hacker News
              </h2>
              {allData.hackernews.length > 0 ? (
                <HackerNewsFeed posts={allData.hackernews} />
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                  Aucun article trouvé.
                </div>
              )}
            </section>
          )}

          {activeFilters.includes('taddy') && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Podcasts populaires
              </h2>
              {allData.taddy.length > 0 ? (
                <TaddyPodcastFeed episodes={allData.taddy} />
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                  Aucun podcast trouvé.
                </div>
              )}
            </section>
          )}

          {activeFilters.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              Aucune source sélectionnée. Utilisez les filtres ci-dessus pour choisir.
            </div>
          )}
        </div>
      )}
    </div>
  );
}