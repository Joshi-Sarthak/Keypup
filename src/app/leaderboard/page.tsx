"use client"

import React, { useEffect, useState } from "react"

export default function Page() {
  interface TopResult {
    playerName: string
    subType: string
    wpm: number
  }

  interface LeaderboardMode {
    mode: string
    topResults: TopResult[]
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardMode[]>([])

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

  return (
    <>
      <div className="text-xl font-bold mb-4">Leaderboard</div>
      {leaderboard.length === 0 ? (
        <div>Loading...</div>
      ) : (
        leaderboard.map((mode, index) => (
          <div key={index} className="mb-8">
            <div className="text-lg font-semibold mb-2">
              {mode.mode.charAt(0).toUpperCase() + mode.mode.slice(1)} - {mode.topResults[0]?.subType}
            </div>
            <div>
              {mode.topResults.length > 0 ? (
                mode.topResults.map((result, idx) => (
                  <div key={idx} className="flex justify-between mb-1">
                    <span>{idx + 1}. {result.playerName}</span>
					<span>{result.subType} Subtype</span>
                    <span>{result.wpm} WPM</span>
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
