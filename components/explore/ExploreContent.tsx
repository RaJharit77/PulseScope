'use client';

import { useState, useEffect } from 'react';
import FilterBar from '@/components/explore/FilterBar';
import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';
import { searchYouTube, getTrendingVideos } from '@/services/youtube';
import { searchTaddyPodcasts } from '@/services/taddy';
import SearchBar from '@/components/dashboard/SearchBar';
import { Loader2 } from 'lucide-react';

type YouTubeVideos = Awaited<ReturnType<typeof searchYouTube>>;
type TaddyPodcasts = Awaited<ReturnType<typeof searchTaddyPodcasts>>;

interface SearchResults {
    youtube?: YouTubeVideos;
    taddy?: TaddyPodcasts;
}

const AVAILABLE_FILTERS = ['youtube', 'taddy'] as const;

export default function ExplorePage() {
    const [activeFilters, setActiveFilters] = useState<string[]>(['youtube', 'taddy']);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([
        'Intelligence Artificielle',
        'Changement climatique',
        'Podcast tech',
        'Musique 2025',
    ]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const trending = await getTrendingVideos();
                const titles = trending
                    .map((v: { title: string }) => v.title)
                    .slice(0, 10);
                const keywords = titles
                    .map((t: string) => t.split(' - ')[0].trim())
                    .filter((k: string) => k.length > 0);
                setSuggestions(Array.from(new Set(keywords)));
            } catch (err) {
                console.error('Failed to load suggestions', err);
            } finally {
                setSuggestionsLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const handleSearch = async (query: string) => {
        if (!query) return;
        setKeyword(query);
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const output: SearchResults = {};
            const promises: Promise<void>[] = [];

            if (activeFilters.includes('youtube')) {
                promises.push(searchYouTube(query).then(r => { output.youtube = r; }));
            }
            if (activeFilters.includes('taddy')) {
                promises.push(searchTaddyPodcasts(query).then(r => { output.taddy = r; }));
            }

            await Promise.all(promises);
            setResults(output);
        } catch (err) {
            console.error(err);
            setError('Une erreur est survenue lors de la recherche.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Explorer les tendances
                </h1>
                <p className="text-gray-400">
                    Recherchez un sujet et découvrez les contenus les plus pertinents du moment.
                </p>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-300">Suggestions</span>
                    {suggestionsLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 8).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSearch(s)}
                            disabled={loading}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition disabled:opacity-50"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-300">Sources</span>
                </div>
                <FilterBar
                    availableFilters={AVAILABLE_FILTERS as unknown as string[]}
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                />
            </div>

            <div className="mb-8">
                <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>

            {error && (
                <div className="text-center py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 mb-8">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {results.youtube?.length ? (
                            <section>
                                <h3 className="text-xl font-semibold mb-4 text-red-400">Vidéos YouTube</h3>
                                <YouTubeFeed videos={results.youtube} />
                            </section>
                        ) : null}

                        {results.taddy?.length ? (
                            <section>
                                <h3 className="text-xl font-semibold mb-4 text-purple-400">Podcasts</h3>
                                <TaddyPodcastFeed episodes={results.taddy} />
                            </section>
                        ) : null}

                        {!results.youtube?.length && !results.taddy?.length && (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                Aucun résultat trouvé pour « {keyword} ».
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {!loading && !results && (
                <div className="text-center py-16 text-gray-500">
                    <p>Sélectionnez un sujet ou utilisez la barre de recherche pour commencer.</p>
                </div>
            )}
        </div>
    );
}