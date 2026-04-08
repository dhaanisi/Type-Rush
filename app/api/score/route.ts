import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { username, score, difficulty, maxCombo, duration } = await req.json();

    const existingPlayer = await prisma.player.findUnique({ where: { username } });

    const player = await prisma.player.upsert({
        where: { username },
        update: {
            bestScore: Math.max(existingPlayer?.bestScore || 0, score)
        },
        create: { username, bestScore: score },
    });

    await prisma.gameScore.create({
        data: {
            score,
            difficulty,
            maxCombo,
            duration: duration || 0,
            playerId: player.id,
        },
    });

    return NextResponse.json({ success: true });
}