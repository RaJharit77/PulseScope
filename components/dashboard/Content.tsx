'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/dashboard/SearchBar'
import YouTubeFeed from '@/components/feeds/YouTubeFeed'
import SpotifyTrackFeed from '@/components/feeds/SpotifyTrackFeed'
import SpotifyPodcastFeed from '@/components/feeds/SpotifyPodcastFeed'
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed'
import PopularityChart from '@/components/dashboard/PopularityChart'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { searchYouTube, getPopularityTrends } from '@/services/youtube'
import { searchSpotifyTracks, searchSpotifyPodcasts } from '@/services/spotify'
import { searchTaddyPodcasts } from '@/services/taddy'

type SearchResults = {
    keyword: string
    youtube: Awaited<ReturnType<typeof searchYouTube>>
    spotify: {
        tracks: Awaited<ReturnType<typeof searchSpotifyTracks>>
        podcasts: Awaited<ReturnType<typeof searchSpotifyPodcasts>>
    }
    taddy: Awaited<ReturnType<typeof searchTaddyPodcasts>>
    trends: Awaited<ReturnType<typeof getPopularityTrends>>
}

export default function Content() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null)

    const handleSearch = async (keyword: string) => {
        setIsLoading(true)
        setError(null)
        setSearchResults(null)

        try {
            const [youtubeData, spotifyTracks, spotifyPodcasts, taddyPodcasts, trendsData] = await Promise.all([
                searchYouTube(keyword),
                searchSpotifyTracks(keyword),
                searchSpotifyPodcasts(keyword),
                searchTaddyPodcasts(keyword),
                getPopularityTrends(keyword)
            ])

            setSearchResults({
                keyword,
                youtube: youtubeData,
                spotify: {
                    tracks: spotifyTracks,
                    podcasts: spotifyPodcasts
                },
                taddy: taddyPodcasts,
                trends: trendsData
            })
        } catch (err) {
            console.error('Search error:', err)
            setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative z-10 container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-6xl font-bold mb-4">
                    <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                        PulseScope Dashboard
                    </span>
                </h1>
                <p className="text-xl text-gray-400">
                    Explorez les tendances audio-visuelles en temps réel
                </p>
            </motion.div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
                <div className="mt-8">
                    <ErrorMessage message={error} />
                </div>
            )}

            {isLoading && (
                <div className="mt-12">
                    <LoadingSkeleton />
                </div>
            )}

            {searchResults && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 space-y-8"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">
                            Résultats pour :{' '}
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {searchResults.keyword}
                            </span>
                        </h2>
                    </div>

                    <PopularityChart data={searchResults.trends} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        <YouTubeFeed videos={searchResults.youtube} />
                        <SpotifyTrackFeed tracks={searchResults.spotify.tracks} />
                        <SpotifyPodcastFeed episodes={searchResults.spotify.podcasts} />
                        <TaddyPodcastFeed episodes={searchResults.taddy} />
                    </div>
                </motion.div>
            )}
        </div>
    )
}