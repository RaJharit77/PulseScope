'use client'

import { motion } from 'framer-motion'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

interface PopularityChartProps {
    data: {
        dates: string[]
        datasets: Array<{
            name: string
            data: number[]
            color: string
        }>
    }
}

export default function PopularityChart({ data }: PopularityChartProps) {
    const chartData = data.dates.map((date, index) => {
        const point: any = { date }
        data.datasets.forEach(dataset => {
            point[dataset.name] = dataset.data[index]
        })
        return point
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
        >
            <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Évolution de la popularité (30 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(10,10,10,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: 'white' }}
                    />
                    {data.datasets.map((dataset) => (
                        <Line
                            key={dataset.name}
                            type="monotone"
                            dataKey={dataset.name}
                            stroke={dataset.color}
                            strokeWidth={2}
                            dot={{ fill: dataset.color, r: 3 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    )
}