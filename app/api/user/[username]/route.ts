import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const player = await prisma.player.findUnique({
        where: { username },
        include: {
            gameScores: {
                orderBy: { createdAt: "desc" },
                take: 50,
            },
        },
    });

    if (!player) {
        return NextResponse.json({ error: "Operator session not found" }, { status: 404 });
    }

    // Calculate Global Rank
    const rank = await prisma.player.count({
        where: {
            bestScore: {
                gt: player.bestScore,
            },
        },
    });

    // Calculate Statistics
    const totalGames = await prisma.gameScore.count({ where: { playerId: player.id } });
    const totalPlayTime = player.gameScores.reduce((acc, s) => acc + (s.duration || 0), 0);
    const avgScore = player.gameScores.length > 0
        ? Math.floor(player.gameScores.reduce((acc, s) => acc + s.score, 0) / player.gameScores.length)
        : 0;

    return NextResponse.json({
        profile: {
            username: player.username,
            bestScore: player.bestScore,
            rank: rank + 1,
            totalGames,
            totalPlayTime,
            avgScore,
            commissionedAt: player.createdAt,
        },
        history: player.gameScores,
    });
}
