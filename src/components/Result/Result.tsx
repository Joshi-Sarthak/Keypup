import React, { use } from "react"
import { useTestStore } from "@/lib/zustand/teststore"
import { useGamesStore } from "@/lib/zustand/gamestore"
import { useTimeStore } from "@/lib/zustand/timestore"

export default function Result() {
	const correctCharsForEachSecond = useTestStore.getState().correctCharsForEachSecond
	console.log(useTimeStore.getState().timer)

	// Calculate WPM for each second
	const wpmForEachSecond = correctCharsForEachSecond.map((correctChars, index) => {
		// Calculate WPM for the current second
		const wpm = Math.round((correctChars * 60) / 5)
		return { second: index + 1, wpm }
	})

	return (
		<div>
			<h1>Results</h1>
			<p>Overall Correct Chars: {useTestStore.getState().correctChars}</p>
			<h1>
				WPM :{" "}
				{useGamesStore.getState().time
					? Math.round(
							(useTestStore.getState().correctChars *
								(60 / useGamesStore.getState().totalTime)) /
								5
					  )
					: Math.round((useTestStore.getState().correctChars * 60) /
					  (5 * useTimeStore.getState().timer))}
			</h1>
			<ul>
				{
					wpmForEachSecond.map(({ second, wpm }) => (
						<li key={second}>
							Second {second}: {wpm} WPM
						</li>
					))}
			</ul>
		</div>
	)
}
