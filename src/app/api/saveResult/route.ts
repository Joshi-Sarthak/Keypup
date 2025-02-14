import { getUser } from "@/lib/getUser"
import { prisma } from "@/lib/utils"
import { User as Usertype } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { SubType, Leaderboard } from "@prisma/client" // Import enums from Prisma

export async function POST(req: NextRequest) {
	try {
		const { email } = (await getUser()) as Usertype

		if (!email) {
			return NextResponse.json({ error: "User email not found" }, { status: 400 })
		}

		const user = await prisma.user.findUnique({
			where: { email },
			include: { allResults: true, recentResult: true },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		const { type, subType, rawSpeed, wpm } = await req.json()

		if (!type || !subType || typeof wpm !== "number" || wpm < 0) {
			return NextResponse.json({ error: "Invalid data" }, { status: 400 })
		}

		// Enum mapping for SubType
		const subTypeMapping: Record<string, SubType> = {
			small: SubType.small,
			medium: SubType.medium,
			large: SubType.large,
			"10": SubType.ten,
			"25": SubType.twenty_five,
			"50": SubType.fifty,
			"100": SubType.hundred,
			"15": SubType.fifteen,
			"30": SubType.thirty,
			"60": SubType.sixty,
			"120": SubType.one_twenty,
		}

		const validSubType = subTypeMapping[subType]
		if (!validSubType) {
			return NextResponse.json({ error: "Invalid subType" }, { status: 400 })
		}

		// Default Results Structure
		const defaultResults = Object.entries(subTypeMapping).map(([key, value]) => ({
			id: new ObjectId().toString(),
			userId: user.id,
			type: "default",
			subType: value,
			wpm: 0,
		}))

		// Handle allResults
		let updatedAllResults =
			user.allResults.length === 0 ? defaultResults : [...user.allResults]

		const existingResultIndex = updatedAllResults.findIndex(
			(result) => result.type === type && result.subType === validSubType
		)

		if (existingResultIndex !== -1) {
			const existingResult = updatedAllResults[existingResultIndex]
			if (existingResult.wpm < wpm) {
				updatedAllResults[existingResultIndex].wpm = wpm
			}
		} else {
			updatedAllResults.push({
				id: new ObjectId().toString(),
				userId: user.id,
				type,
				subType: validSubType,
				wpm,
			})
		}

		// Handle recent results (only keep the last 5)
		const updatedRecentResults = [
			{
				id: new ObjectId().toString(),
				userId: user.id,
				type,
				subType: validSubType,
				wpm,
			},
			...user.recentResult.slice(0, 4),
		]

		// Update the user with Prisma-compatible nested updates
		await prisma.user.update({
			where: { email },
			data: {
				allResults: {
					set: [],
					create: updatedAllResults.map((r) => ({
						id: r.id,
						type: r.type,
						subType: r.subType,
						wpm: r.wpm,
						userId: r.userId,
					})),
				},
				recentResult: {
					set: [],
					create: updatedRecentResults.map((r) => ({
						id: r.id,
						type: r.type,
						subType: r.subType,
						wpm: r.wpm,
						userId: r.userId,
					})),
				},
			},
		})

		// Handle leaderboard
		let leaderboard = await prisma.leaderboard.findFirst({
			where: { mode: type },
			include: { topResults: true },
		})

		if (!leaderboard) {
			await prisma.leaderboard.create({
				data: {
					mode: type,
					topResults: {
						create: [
							{
								playerName: user.name,
								subType: validSubType,
								email: user.email,
								rawSpeed: Number(rawSpeed),
								wpm: Number(wpm),
							},
						],
					},
				},
			})
		} else {
			const existingIndex = leaderboard.topResults.findIndex(
				(result) => result.email === user.email
			)

			if (existingIndex !== -1) {
				if (leaderboard.topResults[existingIndex].wpm < Number(wpm)) {
					leaderboard.topResults[existingIndex].wpm = Number(wpm)
				}
			} else {
				leaderboard.topResults.push({
					id: new ObjectId().toString(), // Generate a unique ID
					leaderboardId: leaderboard.id, // Ensure it is linked to the correct leaderboard
					playerName: user.name,
					subType: validSubType,
					rawSpeed: Number(rawSpeed),
					email: user.email,
					wpm: Number(wpm),
				})
			}

			leaderboard.topResults.sort((a, b) => b.wpm - a.wpm)
			leaderboard.topResults = leaderboard.topResults.slice(0, 10)

			await prisma.leaderboard.update({
				where: { mode: type },
				data: {
					topResults: {
						set: [],
						create: leaderboard.topResults.map((r) => ({
							playerName: r.playerName,
							subType: r.subType,
							email: r.email,
							rawSpeed: r.rawSpeed,
							wpm: r.wpm,
						})),
					},
				},
			})
		}

		return NextResponse.json(
			{ message: "Result Saved successfully" },
			{ status: 200 }
		)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: "Failed to save Result" }, { status: 500 })
	}
}