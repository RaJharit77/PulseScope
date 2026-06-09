'use client';

import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, MessageCircle, User } from 'lucide-react';

interface HackerNewsItem {
    id: string;
    title: string;
    url: string;
    author: string;
    points: number;
    comments: number;
    createdAt: string;
}

interface HackerNewsFeedProps {
    posts: HackerNewsItem[];
}

export default function HackerNewsFeed({ posts }: HackerNewsFeedProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hacker News
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {posts.map((post, index) => (
                    <motion.a
                        key={`${post.id}-${index}`}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-orange-500/50 transition-all group"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-orange-400" /> {post.points} points
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3 text-blue-400" /> {post.comments} comments
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {post.author}
                                </span>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors shrink-0" />
                    </motion.a>
                ))}
            </div>
        </div>
    );
}