"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTestStore } from "@/lib/store"
import { RecordTest } from "@/lib/TestHelpers/recordTest"

function Main() {
	const initialWords = useTestStore((state) => state.initialWords)
	const typedWord = useTestStore((state) => state.typedWord)
	const currWord = useTestStore((state) => state.currWord)
	const currWordIndex = useTestStore((state) => state.currWordIndex)
	const seedWords = useTestStore((state) => state.seedWords)
	const reset = useTestStore((state) => state.reset)

	const activeWord = useRef<HTMLDivElement>(null)
	const activeLetter = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		seedWords()
	}, [seedWords])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "b") {
				//restart logic
				e.preventDefault()
				reset()
			} else if (e.key.length === 1 || e.key === "Backspace") {
				RecordTest(e.key)
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	useEffect(() => {
		const index = typedWord.length - 1
		const currWordRef = activeWord.current

		if (currWordRef && index >= 0) {
			if (currWord[index] === typedWord[index]) {
				activeLetter.current?.classList.add("correct")
			} else {
				activeLetter.current?.classList.add("wrong")
			}
		}
	}, [currWord, typedWord])

	return (
		<div className="flex justify-center w-full mt-64">
			<div className="w-3/4 max-w-full flex flex-wrap">
				{initialWords.map((word, id) => {
					const isActive = id === currWordIndex

					return (
						<div
							key={id}
							ref={isActive ? activeWord : null}
							className="text-3xl text-stone-500 dark:text-neutral-500 tracking-wide mx-2 my-1 inline-block"
						>
							{word.split("").map((letter, key) => {
								return (
									<span
										id="resetable"
										key={key}
										ref={
											isActive && typedWord.length - 1 == key
												? activeLetter
												: null
										}
									>
										{letter}
									</span>
								)
							})}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Main
