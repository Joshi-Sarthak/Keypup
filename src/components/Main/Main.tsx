"use client"

import React, { useEffect, useState } from "react"
import english from "@/lib/Languages/english.json"

function Main() {
	const { words } = english
	const [initalWords, setInitialWords] = useState<string[]>([])

	useEffect(() => {
		const seedWords = []
		for (let i = 0; i < 50; i++) {
			const index = Math.floor(Math.random() * words.length)
			seedWords.push(words[index])
		}
		setInitialWords(seedWords)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		document.onkeydown = (e) => {
			console.log(e.key)
		}
	})

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		console.log(e.target.value)
	}

	return (
		<div className="flex flex-row justify-center ">
			<div className="w-3/4 bg-transparent mt-64">
				{initalWords.map((currWord, id) => {
					return (
						<span
							key={id}
							className="text-3xl text-stone-500 dark:text-neutral-500 tracking-wide mx-2"
						>{`${currWord} `}</span>
					)
				})}
			</div>
		</div>
	)
}

export default Main
