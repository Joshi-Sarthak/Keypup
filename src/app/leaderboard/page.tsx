"use client"

import React, { useEffect } from "react"

export default function Page() {
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
				}
			} catch (err) {
				console.error("Result error:", err)
			}
		}

		saveResult()
	}, [])

	return <div>Leaderboard</div>
}
