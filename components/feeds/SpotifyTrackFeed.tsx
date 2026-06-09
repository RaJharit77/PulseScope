'use client'

import { motion } from 'framer-motion';
import { Play, ExternalLink, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SpotifyTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    thumbnail: string;
    popularity: number;
    previewUrl: string | null;
    spotifyUrl: string;
}

export default function SpotifyTrackFeed({ tracks }: { tracks: SpotifyTrack[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Musique Spotify
            </h2>

            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {tracks.map((track) => (
                    <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-green-500/50 transition-all"
                    >
                        <div className="flex gap-3">
                            <Image
                                src={track.thumbnail}
                                alt={track.album}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{track.title}</h3>
                                <p className="text-sm text-gray-400">{track.artist}</p>
                                <p className="text-xs text-gray-500">{track.album}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-gray-400">
                                        Popularité: {track.popularity}/100
                                    </span>
                                </div>
                            </div>
                            {track.previewUrl && (
                                <button className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition">
                                    <Play className="w-4 h-4 text-green-400" />
                                </button>
                            )}
                            <Link
                                href={track.spotifyUrl}
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