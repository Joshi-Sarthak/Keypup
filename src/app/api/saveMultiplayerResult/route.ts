import MultiplayerResults from "@/components/MultiplayerResult/MultiplayerResults"
import { getUser } from "@/lib/getUser"
import { prisma } from "@/lib/utils"
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
		const userData = await getUser()
		const email = userData?.email ?? undefined

		if (!email) {
			return NextResponse.json(
				{ error: "User email is required" },
				{ status: 400 }
			)
		}

		// Fetch user using Prisma
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				multiplayerResults: true, // Include this relation
			},
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		if (!user.multiplayerResults) {
			return NextResponse.json(
				{ error: "User multiplayer results not found" },
				{ status: 404 }
			)
		}

		const { PlayerResult } = await req.json()

		if (!PlayerResult) {
			return NextResponse.json({ error: "Invalid data" }, { status: 400 })
		}

		let emailTicked = false

		PlayerResult.map(async (result: PlayerResult) => {
			if (result.email === email) {
				console.log("result", result)
				const wpm =
					Math.round(result.correctChars * 60) / (5 * result.totalTime)

				if (PlayerResult[0].email === email && emailTicked == false) {
					console.log("result win ", result)
					await prisma.user.update({
						where: { email },
						data: {
							multiplayerResults: {
								upsert: {
									create: {
										wins: 1, // If multiplayerResults doesn't exist, create it
										losses: 0,
										averageWPM: wpm, // Use the calculated wpm
									},
									update: {
										wins: { increment: emailTicked ? 1 : 0 },
										losses: { increment: emailTicked ? 0 : 1 },
										averageWPM: Math.round(
											((user.multiplayerResults?.averageWPM ||
												0) *
												(user.multiplayerResults?.wins || 0) +
												wpm) /
												((user.multiplayerResults?.wins || 0) +
													(user.multiplayerResults?.losses ||
														0) +
													1)
										),
									},
								},
							},
						},
					})

					emailTicked = true
				} else {
					console.log("losses", result)
					await prisma.user.update({
						where: { email },
						data: {
							multiplayerResults: {
								update: {
									wins: (user.multiplayerResults?.wins ?? 0) + 1, // Ensure it's incremented correctly
									losses: user.multiplayerResults?.losses || 0,
									averageWPM:
										user.multiplayerResults?.averageWPM || 0,
								},
							},
						},
					})
				}

				await prisma.user.update({
					where: { email },
					data: {
						multiplayerResults: {
							upsert: {
								create: {
									wins: 1,
									losses: 0,
									averageWPM: wpm,
								},
								update: {
									wins: { increment: emailTicked ? 1 : 0 },
									losses: { increment: emailTicked ? 0 : 1 },
									averageWPM: Math.round(
										((user.multiplayerResults?.averageWPM || 0) *
											(user.multiplayerResults?.wins || 0) +
											wpm) /
											((user.multiplayerResults?.wins || 0) +
												(user.multiplayerResults?.losses || 0) +
												1)
									),
								},
							},
						},
					},
				})

				console.log("user.multiplayerWPM", user.multiplayerResults)
			}
		})

		return NextResponse.json(
			{ message: "Result Saved successfully" },
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json({ error: "Failed to save Result" }, { status: 500 })
	}
}
