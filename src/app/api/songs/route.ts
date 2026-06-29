import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      singer: true,
      lyricist: true,
      composer: true,
    },
  });
  return NextResponse.json(songs);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const song = await prisma.song.create({
    data: {
      songTitle: data.songTitle,
      alternateTitle: data.alternateTitle || null,
      language: data.language || "Hindi",
      category: data.category || "OTHER",
      genre: data.genre || null,
      mood: data.mood || null,
      singerId: data.singerId || null,
      lyricistId: data.lyricistId || null,
      composerId: data.composerId || null,
      musicDirectorId: data.musicDirectorId || null,
      producerName: data.producerName || null,
      labelName: data.labelName || "Bainsla Music",
      copyrightOwner: data.copyrightOwner || null,
      revenueSharePercentage: data.revenueSharePercentage
        ? parseFloat(data.revenueSharePercentage)
        : null,
      currentStage: data.currentStage || "IDEA",
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
      isrc: data.isrc || null,
      upc: data.upc || null,
      lyrics: data.lyrics || null,
      description: data.description || null,
      internalNotes: data.internalNotes || null,
    },
  });

  // Log status history
  await prisma.songStatusHistory.create({
    data: {
      songId: song.id,
      newStatus: "IDEA",
      changedBy: session.id,
      note: "Song created",
    },
  });

  return NextResponse.json(song, { status: 201 });
}
