'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Eye, Clock } from 'lucide-react'
import Image from 'next/image'

interface YouTubeStatistics {
    viewCount: string
}

interface YouTubeVideo {
    id: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    statistics: YouTubeStatistics
    url: string
}

interface YouTubeFeedProps {
    videos: YouTubeVideo[]
}

export default function YouTubeFeed({ videos }: YouTubeFeedProps) {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return 'Hier'
        if (diffDays < 7) return `Il y a ${diffDays} jours`
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
        return date.toLocaleDateString('fr-FR')
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Vidéos YouTube
            </h2>

            {playingVideo && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-4 z-10 bg-black/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20 shadow-2xl"
                >
                    <div className="relative pt-[56.25%]">
                        <iframe
                            src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&controls=1&rel=0`}
                            title="YouTube video player"
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                    <button
                        onClick={() => setPlayingVideo(null)}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Fermer
                    </button>
                </motion.div>
            )}

            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {videos.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-red-500/50 transition-all group cursor-pointer"
                        onClick={() => setPlayingVideo(video.id)}
                    >
                        <div className="relative w-40 h-24 shrink-0">
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                {video.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{video.channelTitle}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {parseInt(video.statistics.viewCount || '0').toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(video.publishedAt)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}