'use client'

import { motion } from 'framer-motion'
import { MessageCircle, TrendingUp, ExternalLink } from 'lucide-react'

interface RedditPost {
    id: string
    title: string
    subreddit: string
    score: number
    num_comments: number
    url: string
    created: number
}

interface RedditFeedProps {
    posts: RedditPost[]
}

export default function RedditFeed({ posts }: RedditFeedProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Tendances Reddit
            </h2>
            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                {posts.map((post, index) => (
                    <motion.a
                        key={post.id}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="block p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-orange-500/50 transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {post.score.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {post.num_comments.toLocaleString()}
                                    </span>
                                    <span className="text-orange-400">{post.subreddit}</span>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}