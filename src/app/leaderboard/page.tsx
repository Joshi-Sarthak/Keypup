"use client"

import React, { useEffect, useState } from "react"

export default function Page() {
	interface LeaderboardMode {
		mode: string
		subType: string
		topResults: { playerName: string; wpm: number }[]
	}

	const [leaderboard, setLeaderboard] = useState<LeaderboardMode[]>([])

	useEffect(() => {
		const saveResult = async () => {
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
					console.log("Failed to save result", data)
				} else {
					setLeaderboard(data.name)
				}
			} catch (err) {
				console.error("Result error:", err)
			}
		}

		saveResult()
	}, [])

	return (
		<>
			<div className="">Leaderboard</div>
			{leaderboard.length === 0 ? (
				<div>Loading...</div>
			) : (
				leaderboard.map((mode, index) => (
					<div key={index} className="">
						<div className="">
							{mode.mode} - {mode.subType}
						</div>
						<div>
							{mode.topResults.length > 0 ? (
								mode.topResults.map((result, idx) => (
									<div key={idx} className="">
										<span>
											{idx + 1}. {result.playerName}
										</span>
										<span> {result.wpm} WPM</span>
									</div>
								))
							) : (
								<div>No results available</div>
							)}
						</div>
					</div>
				))
			)}
		</>
	)
}
