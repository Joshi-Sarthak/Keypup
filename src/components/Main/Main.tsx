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
											ref={isActive && typedWord.length - 1 == key
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
			{/* Restart SVG Icon */}
			<div onClick={Restart} className="cursor-pointer mt-2">
				<svg
					width="24px"    
					height="24px"   
					viewBox="0 0 24 24"  
					className="w-6 h-6 text-stone-500 dark:text-neutral-500 mx-auto"  
				>
					<title>Reload</title>
					<g
						id="Page-1"
						stroke="none"
						strokeWidth="1"
						fill="none"
						fillRule="evenodd"
					>
						<g id="Reload">
							<path
								d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762"
								id="Path"
								stroke="#787474"
								strokeWidth="2"
								strokeLinecap="round"
							></path>
							<path
								d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768"
								id="Path"
								stroke="#787474"
								strokeWidth="2"
								strokeLinecap="round"
							></path>
						</g>
					</g>
				</svg>
			</div>
		</div>
	)
}

export default Main
