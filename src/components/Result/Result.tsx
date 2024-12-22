import React from "react"
import { useTestStore } from "@/lib/zustand/teststore"

export default function Result() {
  const correctCharsForEachSecond = useTestStore.getState().correctCharsForEachSecond
  
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
      <h1>WPM : {Math.round(useTestStore.getState().correctChars*2/5)}</h1>
      <h2>WPM for Each Second</h2>
      <ul>
        {wpmForEachSecond.map(({ second, wpm }) => (
          <li key={second}>
            Second {second}: {wpm} WPM
          </li>
        ))}
      </ul>
    </div>
  )
}
