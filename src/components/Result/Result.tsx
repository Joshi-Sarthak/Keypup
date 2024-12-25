"use client"

import React, { useMemo, useEffect, useState } from "react"
import { useTestStore } from "@/lib/zustand/teststore"
import { useGamesStore } from "@/lib/zustand/gamestore"
import { useTimeStore } from "@/lib/zustand/timestore"
import dynamic from "next/dynamic"
import "chart.js/auto"

// Dynamically import the Line chart from Chart.js
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
	ssr: false,
})

export default function Result() {
	const correctCharsForEachSecond = useTestStore.getState().correctCharsForEachSecond
	const correctChars = useTestStore.getState().correctChars || 0
	const totalTime =
		useGamesStore.getState().totalTime || useTimeStore.getState().timer || 1

	const [isClient, setIsClient] = useState(false)

	// Handle SSR and enable client rendering
	useEffect(() => {
		setIsClient(true)
	}, [])

	const wpmForEachSecond = useMemo(() => {
		let cumulativeChars = 0
		return correctCharsForEachSecond.map((chars, index) => {
			cumulativeChars += chars // Sum up characters up to the current second
			const cumulativeWPM = Math.round((cumulativeChars * 60) / (5 * (index + 1)))
			return { second: index + 1, wpm: cumulativeWPM }
		})
	}, [correctCharsForEachSecond])

	// Calculate overall WPM
	const overallWPM = Math.round((correctChars * 60) / (5 * totalTime))

	// Prepare chart data
	const chartData = {
		labels: wpmForEachSecond.map((entry) => `${entry.second}`),
		datasets: [
			{
				label: "WPM Over Time",
				data: wpmForEachSecond.map((entry) => entry.wpm),
				borderColor: "rgb(136, 4, 228)",
				borderWidth: 2,
				fill: false,
				tension: 0.4,
				pointRadius: 2,
			},
		],
	}

	// Chart options
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					maxTicksLimit: 30,
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(200, 200, 200, 0.2)",
				},
				ticks: {
					stepSize: 10,
				},
			},
		},
	}

	return (
		<div>
			<h1>Results</h1>
			<p>Overall Correct Characters: {correctChars}</p>
			<h2>WPM: {overallWPM}</h2>
			<h2>Raw Speed : {Math.round((useTestStore.getState().rawChars * 60) / (5 * totalTime))}</h2>
			<h3>WPM Trend Chart:</h3>
			<div style={{ width: "900px", height: "500px", margin: "auto" }}>
				{isClient ? (
					<Line data={chartData} options={chartOptions} />
				) : (
					<p>Loading chart...</p>
				)}
			</div>
		</div>
	)
}
