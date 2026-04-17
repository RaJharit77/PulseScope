'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import ThreeBackground from '@/components/ThreeBackground'
import SearchBar from '@/components/SearchBar'
//import RedditFeed from '@/components/RedditFeed'
import YouTubeFeed from '@/components/YouTubeFeed'
import PodcastFeed from '@/components/PodcastFeed'
import PopularityChart from '@/components/PopularityChart'
import SpotifyPodcastFeed from '@/components/SpotifyPodcastFeed';
import SpotifyTrackFeed from '@/components/SpotifyTrackFeed';
import TaddyPodcastFeed from '@/components/TaddyPodcastFeed';
import { getPopularityTrends, searchYouTube } from '@/services/youtube'
//import { searchReddit, searchPodcasts } from '@/services/reddit'
import { searchPodcasts } from '@/services/listen_notes'

const queryClient = new QueryClient()

function HomeContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)

  const handleSearch = async (keyword: string) => {
    setIsLoading(true)
    try {
      const [redditData, youtubeData, podcastData, trendsData] = await Promise.all([
        //searchReddit(keyword),
        searchYouTube(keyword),
        searchPodcasts(keyword),
        getPopularityTrends(keyword)
      ])

      setSearchResults({
        keyword,
        reddit: redditData,
        youtube: youtubeData,
        podcasts: podcastData,
        trends: trendsData
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative">
      <ThreeBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              PulseScope
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Explorez les tendances sociales et contenus audio-visuels en temps réel
          </p>
        </motion.div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {searchResults && (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/*<RedditFeed posts={searchResults.reddit} />*/}
              <YouTubeFeed videos={searchResults.youtube} />
              <PodcastFeed podcasts={searchResults.podcasts} />
              <YouTubeFeed videos={searchResults.youtube} />
              <SpotifyTrackFeed tracks={searchResults.spotify.tracks} />
              <SpotifyPodcastFeed episodes={searchResults.spotify.podcasts} />
              <TaddyPodcastFeed episodes={searchResults.podcasts} />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  )
}