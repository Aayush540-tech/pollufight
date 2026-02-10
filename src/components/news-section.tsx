"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Newspaper, ExternalLink, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NewsItem {
    id: string
    title: string
    source: string
    time: string
    summary: string
    tag: "CRITICAL" | "UPDATE" | "GLOBAL" | "POLCY"
    url: string
}

export function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulated fetch of live pollution news
        // In a production app, this would call a News API filtered by 'pollution', 'environment', etc.
        const timer = setTimeout(() => {
            setNews([
                {
                    id: "1",
                    title: "Faridabad Air Quality Remains 'Very Poor'; Local Authorities Eye GRAP-III Measures",
                    source: "Environment Desk",
                    time: "42m ago",
                    summary: "Local monitoring stations report AQI exceeding 350. Construction bans may be reintroduced to mitigate dust pollution.",
                    tag: "CRITICAL",
                    url: "#"
                },
                {
                    id: "2",
                    title: "New Policy: Mandatory Emission Sensors for Heavy Industrial Units in NCR",
                    source: "State Gazette",
                    time: "2h ago",
                    summary: "The Environment Ministry has announced a fast-track mandate for IoT-based emission tracking in industrial zones.",
                    tag: "POLCY",
                    url: "#"
                },
                {
                    id: "3",
                    title: "Global Summit: UN Highlights Himalayan Glacial Melt Due to Carbon Deposits",
                    source: "World News",
                    time: "4h ago",
                    summary: "New study reveals black carbon from stubble burning is accelerating glacial retreat at record speeds.",
                    tag: "GLOBAL",
                    url: "#"
                },
                {
                    id: "4",
                    title: "Community Win: NGO Successfully Restores Yamuna Stretch Near Okhla",
                    source: "Local Impact",
                    time: "6h ago",
                    summary: "Bioremediation techniques have reduced chemical levels by 40% in the selected test stretch over the last quarter.",
                    tag: "UPDATE",
                    url: "#"
                }
            ])
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const getTagStyle = (tag: string) => {
        switch (tag) {
            case "CRITICAL": return "bg-red-500/10 text-red-500 border-red-500/20"
            case "POLCY": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "GLOBAL": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
            default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-primary" />
                        Live Pollution News
                    </h2>
                    <p className="text-sm text-muted-foreground font-mono">Real-time environmental intelligence</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1.5" />
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">LIVE FEED</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
                    ))
                ) : (
                    news.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="border-border/40 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all group cursor-pointer overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getTagStyle(item.tag)}`}>
                                            {item.tag}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {item.time}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-[10px] font-mono font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                                            {item.source}
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full group-hover:bg-primary/20 group-hover:text-primary">
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {!loading && (
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 font-mono text-xs tracking-widest uppercase">
                    View All Intelligence
                </Button>
            )}
        </div>
    )
}
