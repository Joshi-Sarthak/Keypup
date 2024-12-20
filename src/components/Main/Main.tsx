"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTestStore } from "@/lib/store"
import { RecordTest } from "@/lib/TestHelpers/recordTest"
import { MdRefresh } from "react-icons/md"
import { VscDebugRestart } from "react-icons/vsc"

function Main() {
	const initialWords = useTestStore((state) => state.initialWords)
	const typedWord = useTestStore((state) => state.typedWord)
	const currWord = useTestStore((state) => state.currWord)
	const currWordIndex = useTestStore((state) => state.currWordIndex)
	const seedWords = useTestStore((state) => state.seedWords)
	const reset = useTestStore((state) => state.reset)
	const [isHovered, setIsHovered] = useState(false)

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
				RecordTest(e.key, activeLetter.current)
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
			<VscDebugRestart
				onClick={Restart}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="w-8 h-8 text-stone-400 dark:text-neutral-600 hover:text-stone-500 hover:dark:text-neutral-500 transition-all duration-200 ease-in-out mx-auto"
			/>
			{isHovered && (
				<div
					className={
						"text-center text-xs text-stone-400 dark:text-neutral-600"
					}
				>
					Restart Test
				</div>
			)}
		</div>
	)
}

export default Main
