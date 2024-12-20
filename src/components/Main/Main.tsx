"use client"

import React, { useEffect, useRef } from "react"
import { useTestStore } from "@/lib/store"
import { RecordTest } from "@/lib/TestHelpers/recordTest"
import { MdRefresh } from "react-icons/md"

function Main() {
	const initialWords = useTestStore((state) => state.initialWords)
	const typedWord = useTestStore((state) => state.typedWord)
	const currWord = useTestStore((state) => state.currWord)
	const currWordIndex = useTestStore((state) => state.currWordIndex)
	const seedWords = useTestStore((state) => state.seedWords)
	const reset = useTestStore((state) => state.reset)

	const activeWord = useRef<HTMLDivElement>(null)
	const activeLetter = useRef<HTMLSpanElement>(null)

	const Restart = () => {
		reset()
	}

	useEffect(() => {
		seedWords()
	}, [seedWords])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "b") {
				Restart()
			} else if (e.key.length === 1 || e.key === "Backspace") {
				RecordTest(e.key,activeLetter.current)
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		<div>
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
			<div className="relative  mt-2 group">
				<MdRefresh
					className="mx-auto text-stone-500 dark:text-neutral-500 pointer-events-auto cursor-pointer"
					size={25}
				/>
				<span className="absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:top-[110%] transition-all text-xs duration-500 text-stone-500 dark:text-neutral-500 pointer-events-auto ">
					Restart Test
				</span>
			</div>
		</div>
	)
}

export default Main
