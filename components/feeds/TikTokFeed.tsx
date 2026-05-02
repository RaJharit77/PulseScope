'use client';

import { motion } from 'framer-motion';
import { Eye, Heart, Share2, MessageCircle, Clock } from 'lucide-react';
import Image from 'next/image';

interface TikTokVideo {
    id: string;
    title: string;
    description?: string;
    thumbnail: string;
    author: string;
    views: string;
    likes?: string;
    shares?: string;
    comments?: string;
    embedUrl: string;
    duration?: number;
}

interface TikTokFeedProps {
    videos: TikTokVideo[];
}

export default function TikTokFeed({ videos }: TikTokFeedProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                TikTok
            </h2>
            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {videos.map((video, index) => (
                    <motion.a
                        key={`${video.id}-${index}`}
                        href={video.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-pink-500/50 transition-all group cursor-pointer"
                    >
                        <div className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden">
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                sizes="96px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                                {video.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">@{video.author}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {video.views}
                                </span>
                                {video.likes && (
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" /> {video.likes}
                                    </span>
                                )}
                                {video.shares && (
                                    <span className="flex items-center gap-1">
                                        <Share2 className="w-3 h-3" /> {video.shares}
                                    </span>
                                )}
                                {video.comments && (
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" /> {video.comments}
                                    </span>
                                )}
                                {video.duration && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {video.duration}s
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}