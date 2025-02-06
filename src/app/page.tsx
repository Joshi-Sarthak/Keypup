"use client"

import { use, useEffect } from "react"
import Controlbar from "@/components/Controlbar/Controlbar"
import Main from "@/components/Main/Main"
import Result from "@/components/Result/Result"
import { useTestStore } from "@/lib/zustand/teststore"
import { useMultiplayerstore } from "@/lib/zustand/multiplayerstore"

export default function Home() {
	const loadResult = useTestStore((state) => state.loadResult)
	const returningFromMultiplayerResult = useMultiplayerstore(
		(state) => state.inResult
	)

	const resetTestStore = useTestStore((state) => state.reset)

	if (!loadResult && returningFromMultiplayerResult) {
		resetTestStore()
		useMultiplayerstore.getState().reset()
	}

	useEffect(() => {
		if (useMultiplayerstore.getState().isMultiplayer) {
			useMultiplayerstore.getState().setisMultiplayer(false)
		}
	}, [])

	return loadResult ? (
		<Result />
	) : (
		<>
			<Controlbar />
			<Main />
		</>
	)
}
