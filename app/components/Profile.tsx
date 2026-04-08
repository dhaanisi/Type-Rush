"use client";
import { useEffect, useState } from "react";
import Leaderboard from "./Leaderboard";

interface GameScore {
    id: string;
    score: number;
    difficulty: string;
    maxCombo: number;
    createdAt: string;
}

interface ProfileData {
    username: string;
    bestScore: number;
    rank: number;
    totalGames: number;
    totalPlayTime: number;
    avgScore: number;
    commissionedAt: string;
}

interface ProfileProps {
    username: string;
    onBack: () => void;
    initialTab?: "personal" | "global";
}

export default function Profile({ username, onBack, initialTab = "personal" }: ProfileProps) {
    const [data, setData] = useState<ProfileData | null>(null);
    const [history, setHistory] = useState<GameScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"personal" | "global">(initialTab);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/user/${username}`);
                const json = await res.json();
                if (json.profile) {
                    setData(json.profile);
                    setHistory(json.history);
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full font-terminal text-matrix-green animate-pulse">
                <p className="text-xl tracking-[0.5em] uppercase">ACCESSING_RECORDS...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full font-terminal text-matrix-danger">
                <p className="text-lg uppercase mb-4">// ERROR: OPERATOR_NOT_FOUND</p>
                <button onClick={onBack} className="matrix-button px-6 py-2">[ RETURN ]</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full font-terminal text-matrix-green p-2 max-w-2xl mx-auto w-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 border-b border-matrix-mid/20 pb-2">
                <div>
                    <p className="text-[8px] tracking-[0.3em] opacity-30 uppercase mb-0.5">// IDENTITY_CONFIRMED</p>
                    <h2 className="text-2xl tracking-widest uppercase text-matrix-bright leading-tight">{data.username}</h2>
                </div>
                <button 
                    onClick={onBack}
                    className="matrix-button px-3 py-1 text-[9px] opacity-40 hover:opacity-100"
                >
                    [ CLOSE ]
                </button>
            </div>

            {/* Tab Search */}
            <div className="flex gap-4 mb-4 border-b border-matrix-mid/10 pb-0 shrink-0">
                <button
                    onClick={() => setActiveTab("personal")}
                    className={`pb-2 text-[10px] tracking-widest uppercase transition-all relative ${activeTab === "personal" ? 'text-matrix-bright opacity-100' : 'opacity-40 hover:opacity-60'}`}
                >
                    RECORDS
                    {activeTab === "personal" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-matrix-bright shadow-[0_0_10px_var(--matrix-bright)]" />}
                </button>
                <button
                    onClick={() => setActiveTab("global")}
                    className={`pb-2 text-[10px] tracking-widest uppercase transition-all relative ${activeTab === "global" ? 'text-matrix-bright opacity-100' : 'opacity-40 hover:opacity-60'}`}
                >
                    LEADERBOARD
                    {activeTab === "global" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-matrix-bright shadow-[0_0_10px_var(--matrix-bright)]" />}
                </button>
            </div>

            {activeTab === "personal" ? (
                <>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 shrink-0">
                        <div className="border border-matrix-mid/10 p-2 bg-matrix-green/5">
                            <p className="text-[8px] opacity-30 mb-0.5 uppercase">Rank</p>
                            <p className="text-lg text-matrix-bright">#{data.rank}</p>
                        </div>
                        <div className="border border-matrix-mid/10 p-2 bg-matrix-green/5">
                            <p className="text-[8px] opacity-30 mb-0.5 uppercase">Best</p>
                            <p className="text-lg text-matrix-bright">{data.bestScore}</p>
                        </div>
                        <div className="border border-matrix-mid/10 p-2 bg-matrix-green/5">
                            <p className="text-[8px] opacity-30 mb-0.5 uppercase">Sessions</p>
                            <p className="text-lg text-matrix-bright">{data.totalGames}</p>
                        </div>
                        <div className="border border-matrix-mid/10 p-2 bg-matrix-green/5">
                            <p className="text-[8px] opacity-30 mb-0.5 uppercase">Avg</p>
                            <p className="text-lg text-matrix-bright">{data.avgScore}</p>
                        </div>
                        <div className="border border-matrix-mid/10 p-2 bg-matrix-green/5">
                            <p className="text-[8px] opacity-30 mb-0.5 uppercase">Play Time</p>
                            <p className="text-lg text-matrix-bright">
                                {Math.floor(data.totalPlayTime / 60)}:{(data.totalPlayTime % 60).toString().padStart(2, "0")}
                            </p>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <p className="text-[9px] tracking-widest opacity-30 uppercase mb-2">// RECENT_ENGAGEMENTS</p>
                        <div className="flex-1 overflow-y-auto scrollbar-hide border border-matrix-mid/10 rounded-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-black">
                                    <tr className="bg-matrix-mid/10 text-[8px] uppercase tracking-widest">
                                        <th className="p-2 border-b border-matrix-mid/20">Date</th>
                                        <th className="p-2 border-b border-matrix-mid/20">Level</th>
                                        <th className="p-2 border-b border-matrix-mid/20 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-matrix-mid/5">
                                    {history.map((session) => (
                                        <tr key={session.id} className="text-[11px] border-b border-matrix-mid/5 hover:bg-matrix-green/5 transition-colors">
                                            <td className="p-3 opacity-60">{new Date(session.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 uppercase tracking-tighter opacity-80">{session.difficulty}</td>
                                            <td className="p-3 text-right text-matrix-bright">{session.score}</td>
                                            <td className="p-3 text-right opacity-60">x{session.maxCombo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <Leaderboard currentUsername={username} />
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-matrix-mid/10 opacity-20 text-[8px] tracking-[0.2em] uppercase text-center">
                system_records_end_of_transmission
            </div>
        </div>
    );
}
