"use client"

import Controlbar from "@/components/Controlbar/Controlbar"
import Main from "@/components/Main/Main"
import Result from "@/components/Result/Result"
import { useTestStore } from "@/lib/zustand/teststore"

export default function Home() {
	const loadResult = useTestStore((state) => state.loadResult)

	return loadResult ? (
		<Result />
	) : (
		<>
			<Controlbar />
			<Main />
		</>
	)
}
