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
		console.log("in req ahjs dsa djks dksa djk askd ")

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

		PlayerResult.map((result: PlayerResult) => {
			if (result.email === email) {
				console.log("result", result)
				const wpm =
					Math.round(result.correctChars * 60) / (5 * result.totalTime)

				if (PlayerResult[0].email === email) {
					user.multiplayerResults.wins += 1
				} else {
					user.multiplayerResults.losses += 1
				}
				console.log("user.averageWPM", user.multiplayerResults.averageWPM)
				console.log("wpm", wpm)
				console.log(
					"user.multiplayerResults.wins",
					user.multiplayerResults.wins
				)
				console.log(
					"user.multiplayerResults.losses",
					user.multiplayerResults.losses
				)

				user.multiplayerResults.averageWPM = parseFloat(
					(
						(user.multiplayerResults.averageWPM *
							(user.multiplayerResults.wins +
								user.multiplayerResults.losses) +
							wpm) /
						(user.multiplayerResults.wins +
							user.multiplayerResults.losses +
							1)
					).toFixed(2)
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
