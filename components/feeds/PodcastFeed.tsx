'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Clock, Headphones } from 'lucide-react'
import Image from 'next/image'

interface Podcast {
    id: string
    title: string
    description: string
    podcastTitle: string
    audioUrl: string
    thumbnail: string
    duration: number
    publishedAt: number
}

interface PodcastFeedProps {
    podcasts: Podcast[]
}

export default function PodcastFeed({ podcasts }: PodcastFeedProps) {
    const [playingId, setPlayingId] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handlePlay = (podcast: Podcast) => {
        if (playingId === podcast.id) {
            audioRef.current?.pause()
            setPlayingId(null)
        } else {
            if (audioRef.current) {
                audioRef.current.src = podcast.audioUrl
                audioRef.current.play()
                setPlayingId(podcast.id)
            }
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Podcasts
            </h2>

            <audio ref={audioRef} className="hidden" />

            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {podcasts.map((podcast, index) => (
                    <motion.div
                        key={podcast.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-500/50 transition-all group"
                    >
                        <div className="relative w-24 h-24 shrink-0">
                            <Image
                                src={podcast.thumbnail}
                                alt={podcast.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                            <button
                                onClick={() => handlePlay(podcast)}
                                className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center"
                            >
                                {playingId === podcast.id ? (
                                    <Pause className="w-8 h-8 text-white" />
                                ) : (
                                    <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                                {podcast.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{podcast.podcastTitle}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(podcast.duration)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Headphones className="w-3 h-3" />
                                    Épisode
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}