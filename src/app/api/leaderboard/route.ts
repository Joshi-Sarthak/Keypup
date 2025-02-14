import { prisma } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"
import { Mode } from "@prisma/client" // Import the Prisma Enum

const gameModes: { type: Mode; subTypes: string[] }[] = [ // Explicitly define type
  { type: "quotes", subTypes: ["small", "medium", "large"] },
  { type: "words", subTypes: ["10", "25", "50", "100"] },
  { type: "time", subTypes: ["15", "30", "60", "120"] },
]

export async function GET(req: NextRequest) {
  try {
    const allTopResults = await Promise.all(
      gameModes.map(async (mode) => {
        const leaderboard = await prisma.leaderboard.findFirst({
          where: { mode: mode.type as Mode }, // Cast mode type to Enum
          select: { mode: true, topResults: true },
        })
        return leaderboard ? { mode: mode.type, topResults: leaderboard.topResults } : null
      })
    )

    return NextResponse.json(allTopResults.filter(Boolean), { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard" },
      { status: 500 }
    )
  }
}
