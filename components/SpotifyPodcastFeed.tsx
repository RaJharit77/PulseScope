'use client'

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SpotifyEpisode {
    id: string;
    title: string;
    description: string;
    podcastTitle: string;
    audioUrl: string | null;
    thumbnail: string;
    duration: number;
    spotifyUrl: string;
}

export default function SpotifyPodcastFeed({ episodes }: { episodes: SpotifyEpisode[] }) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlay = (episode: SpotifyEpisode) => {
        if (!episode.audioUrl) {
            window.open(episode.spotifyUrl, '_blank');
            return;
        }

        if (playingId === episode.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = episode.audioUrl;
                audioRef.current.play();
                setPlayingId(episode.id);
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Podcasts Spotify
            </h2>

            <audio ref={audioRef} className="hidden" />

            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {episodes.map((episode) => (
                    <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-green-500/50 transition-all"
                    >
                        <div className="flex gap-3">
                            <Image
                                src={episode.thumbnail}
                                alt={episode.title}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-white line-clamp-2">
                                    {episode.title}
                                </h3>
                                <p className="text-sm text-gray-400">{episode.podcastTitle}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {Math.floor(episode.duration / 60)} min
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handlePlay(episode)}
                                className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition"
                            >
                                {playingId === episode.id ? (
                                    <Pause className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Play className="w-4 h-4 text-green-400" />
                                )}
                            </button>
                            <Link
                                href={episode.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-green-400"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}