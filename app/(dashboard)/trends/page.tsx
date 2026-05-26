'use client';

import { useState, useEffect } from 'react';
import { getYouTubeTrending, getTaddyTrendingPodcasts } from '@/services/trending';
import { getNewReleases } from '@/services/youtube';
import { getTrendingHackerNews } from '@/services/hackernews';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import HackerNewsFeed from '@/components/feeds/HackerNewsFeed';
import {
  Loader2, Sparkles, TrendingUp, Calendar, Filter, X, Video, Radio, Globe, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FilterPeriod = 'today' | 'week' | 'month';

type YouTubeTrendVideo = NonNullable<Awaited<ReturnType<typeof getYouTubeTrending>>>[number];
type YouTubeNewRelease = NonNullable<Awaited<ReturnType<typeof getNewReleases>>>[number];
type TaddyTrendEpisode = NonNullable<Awaited<ReturnType<typeof getTaddyTrendingPodcasts>>>[number];
type HackerNewsPost = NonNullable<Awaited<ReturnType<typeof getTrendingHackerNews>>>[number];

const AVAILABLE_SOURCES = {
  youtube_trending: { label: 'YouTube tendance', color: 'red', icon: Video },
  youtube_new: { label: 'Nouveautés YouTube', color: 'blue', icon: Zap },
  hackernews: { label: 'Hacker News', color: 'orange', icon: Globe },
  taddy: { label: 'Podcasts populaires', color: 'purple', icon: Radio },
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

  // Charger toutes les données selon la période
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

  const periodFilters: { key: FilterPeriod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'today', label: "Aujourd'hui", icon: Calendar },
    { key: 'week', label: 'Cette semaine', icon: TrendingUp },
    { key: 'month', label: 'Ce mois', icon: Sparkles },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tendances & Nouveautés
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Explorez les contenus les plus populaires de toutes nos sources.
        </p>
      </motion.div>

      {/* Contrôles : période + bouton filtres */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {periodFilters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={() => setPeriod(f.key)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center gap-2 ${period === f.key
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                : 'border-gray-600 text-gray-300 hover:border-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center gap-2 ${showFilters
            ? 'bg-white/10 border-white/30 text-white'
            : 'border-gray-600 text-gray-300 hover:border-white hover:bg-white/5'
            }`}
        >
          <Filter className="w-4 h-4" />
          Sources ({activeFilters.length}/{Object.keys(AVAILABLE_SOURCES).length})
        </button>
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex flex-wrap gap-3 items-center justify-center">
                {Object.entries(AVAILABLE_SOURCES).map(([key, src]) => {
                  const Icon = src.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => toggleFilter(key as SourceKey)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2 ${activeFilters.includes(key as SourceKey)
                        ? 'bg-primary/20 border-primary/50 text-primary-300'
                        : 'border-gray-600 text-gray-400 hover:border-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {src.label}
                      {activeFilters.includes(key as SourceKey) && (
                        <X
                          className="w-4 h-4 ml-1 hover:text-white cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); toggleFilter(key as SourceKey); }}
                        />
                      )}
                    </button>
                  );
                })}
                <div className="flex gap-2 ml-2">
                  <button onClick={selectAll} className="text-xs text-primary hover:underline font-medium">Tout</button>
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:underline">Aucun</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-10">
          {activeFilters.includes('youtube_trending') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Vidéos tendance – {period === 'today' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : 'Ce mois'}
              </h2>
              {allData.youtubeTrending.length > 0 ? (
                <YouTubeFeed videos={allData.youtubeTrending} />
              ) : (
                <div className="text-center py-12 text-gray-400">Aucune tendance trouvée.</div>
              )}
            </motion.section>
          )}

          {activeFilters.includes('youtube_new') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Nouveautés YouTube
              </h2>
              {allData.youtubeNew.length > 0 ? (
                <YouTubeFeed videos={allData.youtubeNew} />
              ) : (
                <div className="text-center py-12 text-gray-400">Aucune nouveauté trouvée.</div>
              )}
            </motion.section>
          )}

          {activeFilters.includes('hackernews') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Hacker News
              </h2>
              {allData.hackernews.length > 0 ? (
                <HackerNewsFeed posts={allData.hackernews} />
              ) : (
                <div className="text-center py-12 text-gray-400">Aucun article trouvé.</div>
              )}
            </motion.section>
          )}

          {activeFilters.includes('taddy') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Podcasts populaires
              </h2>
              {allData.taddy.length > 0 ? (
                <TaddyPodcastFeed episodes={allData.taddy} />
              ) : (
                <div className="text-center py-12 text-gray-400">Aucun podcast trouvé.</div>
              )}
            </motion.section>
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