'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface SearchBarProps {
    onSearch: (keyword: string) => void
    isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [keyword, setKeyword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (keyword.trim()) {
            onSearch(keyword.trim())
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <motion.div
                    className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500"
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Recherchez un sujet (ex: Artificial Intelligence, Climate Change...)"
                        className="w-full px-6 py-4 bg-dark/80 backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:border-primary/50 transition-colors text-lg"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 px-4 py-2 bg-linear-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Recherche...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Explorer</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}