import { connectToDatabase } from "@/lib/utils"
import { Leaderboard } from "@/models/leaderboardModel"
import { NextRequest, NextResponse } from "next/server"

// Define the list of game modes and their subtypes
const gameModes = [
	{ type: "quotes", subTypes: ["small", "medium", "large"] },
	{ type: "words", subTypes: ["10", "25", "50", "100"] },
	{ type: "time", subTypes: ["15", "30", "60", "120"] },
]

export async function GET(req: NextRequest) {

	await connectToDatabase()

	try {
		const allTopResults = []

		for (const mode of gameModes) {
			for (const subType of mode.subTypes) {
				const leaderboard = await Leaderboard.findOne({
					mode: mode.type,
					subType: subType,
				})

				if (leaderboard) {
					allTopResults.push({
						mode: mode.type,
						subType: subType,
						topResults: leaderboard.topResults,
					})
				}
			}
		}
		return NextResponse.json(allTopResults, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: "Failed to retrieve leaderboard" },
			{ status: 500 }
		)
	}
}
