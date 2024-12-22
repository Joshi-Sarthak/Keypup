import React from "react"
import { useTestStore } from "@/lib/zustand/teststore"

export default function Result() {
	return (
		<div>
			<h1>Results</h1>
			<p>WPM : {Math.round((useTestStore.getState().correctChars * 2) / 5)}</p>
			<p>Correct Chars : {useTestStore.getState().correctChars}</p>
		</div>
	)
}
