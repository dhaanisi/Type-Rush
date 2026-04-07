"use client";
import { useEffect, useState } from "react";

interface TopPlayer {
    username: string;
    bestScore: number;
    createdAt: string;
    _count: {
        gameScores: number;
    };
}

interface LeaderboardProps {
    currentUsername?: string;
}

export default function Leaderboard({ currentUsername }: LeaderboardProps) {
    const [leaderboard, setLeaderboard] = useState<TopPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const json = await res.json();
                if (json.leaderboard) {
                    setLeaderboard(json.leaderboard);
                }
            } catch (err) {
                console.error("Failed to load leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 font-terminal text-matrix-green animate-pulse">
                <p className="text-sm tracking-[0.5em] uppercase">LINKING_GLOBAL_RANKS...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full font-terminal text-matrix-green p-2 max-w-2xl mx-auto w-full">
            <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase mb-4 text-center">// GLOBAL_HALL_OF_FAME</p>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide border border-matrix-mid/10 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-matrix-mid/10 text-[9px] uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                            <th className="p-4 border-b border-matrix-mid/20 w-16">Rank</th>
                            <th className="p-4 border-b border-matrix-mid/20">Operator</th>
                            <th className="p-4 border-b border-matrix-mid/20 text-right">Best Score</th>
                            <th className="p-4 border-b border-matrix-mid/20 text-right hidden sm:table-cell">Sessions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((player, index) => {
                            const isMe = currentUsername?.toLowerCase() === player.username.toLowerCase();
                            const rank = index + 1;
                            let rankColor = "var(--matrix-green)";
                            let glowClass = "";
                            
                            if (rank === 1) { rankColor = "#ffd700"; glowClass = "shadow-[0_0_15px_rgba(255,215,0,0.2)]"; }
                            if (rank === 2) { rankColor = "#e5e7eb"; }
                            if (rank === 3) { rankColor = "#cd7f32"; }

                            return (
                                <tr 
                                    key={player.username} 
                                    className={`text-[11px] border-b border-matrix-mid/5 hover:bg-matrix-green/5 transition-colors relative group ${isMe ? 'bg-matrix-green/10' : ''}`}
                                >
                                    <td className="p-3 font-bold" style={{ color: rank <= 3 ? rankColor : "inherit" }}>
                                        <div className="flex items-center gap-1">
                                            <span>{rank.toString().padStart(2, "0")}</span>
                                            {rank === 1 && <span className="text-[10px]">★</span>}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`uppercase tracking-[0.15em] ${isMe ? 'text-matrix-bright font-bold' : ''}`}>{player.username}</span>
                                            {isMe && (
                                                <span className="text-[7px] px-1 py-0.5 bg-matrix-green/20 border border-matrix-green/40 text-matrix-bright animate-pulse">
                                                    YOU
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className={`text-sm ${rank === 1 ? 'text-matrix-bright' : ''}`} style={{ color: rank <= 3 ? rankColor : '' }}>
                                            {player.bestScore.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right opacity-30 text-[9px] hidden sm:table-cell uppercase">
                                        {player._count.gameScores} runs
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 pt-4 text-[8px] tracking-[0.2em] opacity-20 uppercase text-center">
                SYSTEM_RANKS_AUTO_SYNC_ENABLED
            </div>
        </div>
    );
}
