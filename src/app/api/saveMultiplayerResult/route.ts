import MultiplayerResults from "@/components/MultiplayerResult/MultiplayerResults"
import { getUser } from "@/lib/getUser"
import { connectToDatabase } from "@/lib/utils"
import { Leaderboard } from "@/models/leaderboardModel"
import { User } from "@/models/userModel"
import { User as Usertype } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

interface PlayerResult {
	email: string
	id: string
	name: string
	mode: string
	subType: string
	correctChars: number
	rawChars: number
	wpm: number
	totalTime: number
}

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase()

		const { email } = (await getUser()) as Usertype

		const user = await User.findOne({ email })

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		const { PlayerResult } = await req.json()

		if (!PlayerResult) {
			return NextResponse.json({ error: "Invalid data" }, { status: 400 })
		}

		let emailTicked = false

		PlayerResult.map((result: PlayerResult) => {
			if (result.email === email) {
				console.log("result", result)
				const wpm =
					Math.round(result.correctChars * 60) / (5 * result.totalTime)

				if (PlayerResult[0].email === email && emailTicked == false) {
					console.log("result win ", result)
					user.multiplayerResults.wins += 1
					emailTicked = true
				} else {
					console.log("losses", result)
					user.multiplayerResults.losses += 1
				}

				user.multiplayerResults.averageWPM = parseFloat(
					(
						(user.multiplayerResults.averageWPM *
							(user.multiplayerResults.wins +
								user.multiplayerResults.losses) +
							wpm) /
						(user.multiplayerResults.wins +
							user.multiplayerResults.losses +
							1)
					).toFixed(0)
				)

				console.log("user.multiplayerWPM", user.multiplayerResults)
			}
		})

		await User.findOneAndUpdate(
			{ email },
			{ $set: { multiplayerResults: user.multiplayerResults } },
			{ new: true, runValidators: true }
		)

		return NextResponse.json(
			{ message: "Result Saved successfully" },
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json({ error: "Failed to save Result" }, { status: 500 })
	}
}
