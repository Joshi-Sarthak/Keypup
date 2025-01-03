"use client"

import React, { useEffect, useState } from "react"
import { PiMedalFill } from "react-icons/pi"
import { FaA } from "react-icons/fa6"
import { FaRegClock } from "react-icons/fa"
import { BiSolidQuoteAltLeft } from "react-icons/bi"

interface TopResult {
	playerName: string
	subType: string
	rawSpeed: number
	wpm: number
}

interface LeaderboardMode {
	mode: string
	topResults: TopResult[]
}

export default function Page() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardMode[]>([])
	const [selectedMode, setSelectedMode] = useState<string>("words")

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const res = await fetch(`/api/leaderboard`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				})

				const data = await res.json()

				if (!res.ok) {
					console.error("Failed to fetch leaderboard", data)
				} else {
					setLeaderboard(data)
				}
			} catch (err) {
				console.error("Error fetching leaderboard:", err)
			}
		}

		fetchLeaderboard()
	}, [])

	// Helper function to filter leaderboard by mode
	const getModeResults = (mode: string) =>
		leaderboard.find((item) => item.mode.toLowerCase() === mode.toLowerCase())

	return (
		<div className="flex flex-col items-center w-full mt-3">
			<div className="tracking-widest text-3xl my-7 text-stone-500 dark:text-neutral-500 text-center mt-0 mb-1">
				Leaderboard
			</div>
			{/* Mode Selector */}
			<div className="w-1/5 h-14 p-2 mx-auto flex justify-between items-center mt-8  mb-10 bg-neutral-200 dark:bg-[#242120] rounded-full border border-stone-400 dark:border-neutral-700 text-stone-400 dark:text-neutral-600">
				<ul className="flex flex-row font-semibold">
					<li
						className="ml-9 flex flex-row mr-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							setSelectedMode("quotes")
						}}
						style={{
							color: selectedMode === "quotes" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						<BiSolidQuoteAltLeft className="w-5 h-5 mr-2" />
						<span>Quotes</span>
					</li>
					<li
						className="flex flex-row mx-4 mr-5 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							setSelectedMode("words")
						}}
						style={{
							color: selectedMode === "words" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						<FaA className="w-4 h-4 mr-2" />
						<span>Words</span>
					</li>
					<li
						className="flex flex-row ml-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							setSelectedMode("time")
						}}
						style={{
							color: selectedMode === "time" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						<FaRegClock className="w-4 h-4 mr-3" />
						<span>Time</span>
					</li>
				</ul>
			</div>
			{leaderboard.length === 0 ? (
				<div className="text-center text-xl text-stone-500">
					No Results Available
				</div>
			) : (
				<div className="w-3/4 flex justify-center gap-8">
					{/* Render only the selected mode */}
					<div key={selectedMode} className="w-full flex flex-col">
						<div
							className={`w-full border border-stone-300 dark:border-neutral-600 rounded-3xl py-1 ${
								(getModeResults(selectedMode)?.topResults?.length ?? 0) % 2 === 1 ? "pb-4" : "pb-0"
							} px-4 bg-white dark:bg-[#242120]`}
						>
							<div
								className="grid grid-cols-5 text-lg font-medium pt-1 pb-3 border-b border-stone-200 dark:border-neutral-700 text-neutral-300 dark:text-stone-400 text-center bg-white dark:bg-[#242120]"
								style={{
									color: "#7e22ce",
								}}
							>
								<span className="px-2">Rank</span>
								<span className="px-2">Player</span>
								<span className="px-2">Subtype</span>
								<span className="px-2">Raw WPM</span>
								<span className="px-2">WPM</span>
							</div>
							{getModeResults(selectedMode) &&
							getModeResults(selectedMode)?.topResults.length! > 0 ? (
								getModeResults(selectedMode)?.topResults.map(
									(result, idx) => (
										<div
											key={idx}
											className={`grid grid-cols-5 text-base py-2.5 border-b last:border-b-0 border-stone-200 dark:border-neutral-700 text-center text-stone-400 ${
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
											<span className="px-4">
												{result.playerName}
											</span>
											<span className="px-4">
												{result.subType}
											</span>
											<span className="px-4">
												{result.rawSpeed}
											</span>
											<span className="px-4">{result.wpm}</span>
										</div>
									)
								)
							) : (
								<div className="text-center text-stone-500 mt-4">
									No results available
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
