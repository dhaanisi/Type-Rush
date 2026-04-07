import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { username, score, difficulty, maxCombo } = await req.json();

    const player = await prisma.player.upsert({
        where: { username },
        update: {
            bestScore: {
                set: await (async () => {
                    const p = await prisma.player.findUnique({ where: { username } });
                    return Math.max(p?.bestScore || 0, score);
                })()
            }
        },
        create: { username, bestScore: score },
    });

    await prisma.gameScore.create({
        data: {
            score,
            difficulty,
            maxCombo,
            playerId: player.id,
        },
    });

    return NextResponse.json({ success: true });
}