"use client";
import { useEffect, useState } from "react";

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
    avgScore: number;
    commissionedAt: string;
}

interface ProfileProps {
    username: string;
    onBack: () => void;
}

export default function Profile({ username, onBack }: ProfileProps) {
    const [data, setData] = useState<ProfileData | null>(null);
    const [history, setHistory] = useState<GameScore[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="flex flex-col h-full font-terminal text-matrix-green p-2 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b border-matrix-mid/30 pb-4">
                <div>
                    <p className="text-[10px] tracking-[0.3em] opacity-40 uppercase mb-1">// IDENTITY_CONFIRMED</p>
                    <h2 className="text-3xl tracking-widest uppercase text-matrix-bright">{data.username}</h2>
                    <p className="text-[9px] opacity-20 uppercase mt-1">
                        Commissioned_ {new Date(data.commissionedAt).toLocaleDateString()}
                    </p>
                </div>
                <button 
                    onClick={onBack}
                    className="matrix-button px-4 py-1 text-[10px] opacity-60 hover:opacity-100"
                >
                    [ RETURN_TO_SYSTEM ]
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="border border-matrix-mid/20 p-4 bg-matrix-green/5">
                    <p className="text-[9px] opacity-40 mb-1 uppercase">Global Rank</p>
                    <p className="text-2xl text-matrix-bright">#{data.rank}</p>
                </div>
                <div className="border border-matrix-mid/20 p-4 bg-matrix-green/5">
                    <p className="text-[9px] opacity-40 mb-1 uppercase">Best Score</p>
                    <p className="text-2xl text-matrix-bright">{data.bestScore}</p>
                </div>
                <div className="border border-matrix-mid/20 p-4 bg-matrix-green/5">
                    <p className="text-[9px] opacity-40 mb-1 uppercase">Total Sessions</p>
                    <p className="text-2xl text-matrix-bright">{data.totalGames}</p>
                </div>
                <div className="border border-matrix-mid/20 p-4 bg-matrix-green/5">
                    <p className="text-[9px] opacity-40 mb-1 uppercase">Avg Performance</p>
                    <p className="text-2xl text-matrix-bright">{data.avgScore}</p>
                </div>
            </div>

            {/* History Table */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <p className="text-[10px] tracking-[0.3em] opacity-40 uppercase mb-4">// RECENT_ENGAGEMENTS</p>
                <div className="flex-1 overflow-y-auto scrollbar-hide border border-matrix-mid/10 rounded-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-matrix-mid/10 text-[9px] uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                                <th className="p-3 border-b border-matrix-mid/20">Date</th>
                                <th className="p-3 border-b border-matrix-mid/20">Level</th>
                                <th className="p-3 border-b border-matrix-mid/20 text-right">Score</th>
                                <th className="p-3 border-b border-matrix-mid/20 text-right">Combo</th>
                            </tr>
                        </thead>
                        <tbody>
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

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-matrix-mid/10 opacity-20 text-[8px] tracking-[0.2em] uppercase text-center">
                system_records_end_of_transmission
            </div>
        </div>
    );
}
