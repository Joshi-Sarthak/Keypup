"use client"

import React, { useEffect, useState } from "react"
import { PiMedalFill } from "react-icons/pi"
import { FaA } from "react-icons/fa6"
import { FaRegClock } from "react-icons/fa"
import { BiSolidQuoteAltLeft } from "react-icons/bi"
import { socket } from "@/lib/sockets"
import { useMultiplayerstore } from "@/lib/zustand/multiplayerstore"
import { useTestStore } from "@/lib/zustand/teststore"
import { useTimeStore } from "@/lib/zustand/timestore"
import { useGamesStore } from "@/lib/zustand/gamestore"

interface PlayerResult {
	id: string
	name: string
	mode: string
	subType: string
	correctChars: number
	rawChars: number
	wpm: number
	totalTime: number
}

export default function MultiplayerResults() {
	let totalTime = 0
	if (!useGamesStore.getState().time) {
		totalTime = useTimeStore.getState().timer || 1
	} else {
		totalTime = useGamesStore.getState().totalTime || 1
	}

	const mode = useMultiplayerstore((state) => state.mode)
	const subType = useMultiplayerstore((state) => state.subType)
	const correctChars = useTestStore((state) => state.correctChars)
	const rawChars = useTestStore((state) => state.rawChars)
	const [results, setResults] = useState<PlayerResult[]>([])
	const [selectedMode, setSelectedMode] = useState<string>("words")

	useEffect(() => {
		socket.emit("endGame", mode, subType, correctChars, rawChars, totalTime)

		socket.on("gameResults", (gameResults: PlayerResult[]) => {
			console.log("gameResults", gameResults)
			// Sort results by WPM in descending order
			const sortedResults = [...gameResults].sort(
				(a, b) =>
					Math.round((b.correctChars * 60) / (5 * b.totalTime)) -
					Math.round((a.correctChars * 60) / (5 * a.totalTime))
			)
			setResults(sortedResults)
		})

		return () => {
			socket.off("endGameResults")
		}
	}, [])

	//const overallWPM = Math.round((correctChars * 60) / (5 * totalTime))
	//const rawWPM = Math.round((rawChars * 60) / (5 * totalTime))

	return (
		<div className="flex flex-col items-center w-full mt-3">
			<div className="tracking-widest text-3xl my-7 text-stone-500 dark:text-neutral-500 text-center">
				Multiplayer Results
			</div>

			{results.length === 0 ? (
				<div className="text-center text-xl text-stone-500">
					Waiting for results...
				</div>
			) : (
				<div className="w-3/4 flex justify-center gap-8">
					<div className="w-full flex flex-col">
						<div
							className={`w-full border border-stone-300 dark:border-neutral-600 rounded-3xl py-1 px-4 bg-white dark:bg-[#242120]`}
						>
							<div
								className="grid grid-cols-4 text-lg font-medium pt-1 pb-3 border-b border-stone-200 dark:border-neutral-700 text-neutral-300 dark:text-stone-400 text-center"
								style={{ color: "#7e22ce" }}
							>
								<span>Rank</span>
								<span>Player</span>
								<span>Raw WPM</span>
								<span>WPM</span>
							</div>

							{results.map((player, idx) => (
								<div
									key={player.id}
									className={`grid grid-cols-4 text-base py-2.5 border-b last:border-b-0 border-stone-200 dark:border-neutral-700 text-center text-stone-400 ${
										idx % 2 === 0
											? "bg-neutral-200 dark:bg-stone-800"
											: "bg-white dark:bg-[#242120]"
									}`}
								>
									<span className="ml-2">
										{idx == 0 ? (
											<PiMedalFill className="text-yellow-400 ml-32" />
										) : idx == 1 ? (
											<PiMedalFill className="text-gray-300 ml-32" />
										) : idx == 2 ? (
											<PiMedalFill className="text-[#CD7F32] ml-32" />
										) : (
											idx + 1
										)}
									</span>
									<span className="px-4">{player.name}</span>
									<span className="px-4">{Math.round((player.rawChars * 60) / (5 * player.totalTime))}</span>
									<span className="px-4">{Math.round((player.correctChars * 60) / (5 * player.totalTime))}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
