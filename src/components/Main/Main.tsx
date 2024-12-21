"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTestStore } from "@/lib/store"
import { RecordTest } from "@/lib/TestHelpers/recordTest"
import { VscDebugRestart } from "react-icons/vsc"

function Main() {
	const initialWords = useTestStore((state) => state.initialWords)
	const typedWord = useTestStore((state) => state.typedWord)
	const typedWords = useTestStore((state) => state.typedWords)
	const currWord = useTestStore((state) => state.currWord)
	const currWordIndex = useTestStore((state) => state.currWordIndex)
	const seedWords = useTestStore((state) => state.seedWords)
	const reset = useTestStore((state) => state.reset)
	const [isHovered, setIsHovered] = useState(false)
	const [isBlinking, setIsBlinking] = useState(false)
	const [isBackspacing, setIsBackspacing] = useState(false)

	const activeWord = useRef<HTMLDivElement>(null)
	const activeLetter = useRef<HTMLSpanElement>(null)
	const cursorRef = useRef<HTMLSpanElement>(null)
	const measureRef = useRef<HTMLSpanElement>(null)
	let timeoutId = useRef<NodeJS.Timeout | null>(null)

	const Restart = () => {
		setIsBlinking(false)
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
				setIsBackspacing(e.key === "Backspace")
				RecordTest(e.key, activeLetter.current, activeWord.current)
				setIsBlinking(false)

				if (timeoutId.current) {
					clearTimeout(timeoutId.current)
				}

				timeoutId.current = setTimeout(() => {
					setIsBlinking(true)
				}, 500)
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			if (timeoutId.current) clearTimeout(timeoutId.current)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (cursorRef.current && activeWord.current && measureRef.current) {
			measureRef.current.textContent = typedWord
			const typedWidth = measureRef.current.getBoundingClientRect().width
			cursorRef.current.style.transform = `translateX(${typedWidth + 3}px)`
			cursorRef.current.style.transition = isBackspacing
				? "none"
				: "transform 0.1s ease"
		}
	}, [typedWord, isBackspacing])

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

	// Calculate extra letters
	const extraLetters = typedWord.slice(currWord.length).split("")

	return (
		<div>
			<div className="flex justify-center w-full mt-64">
				<div className="w-3/4 max-w-full flex flex-wrap">
					<span
						ref={measureRef}
						className="absolute opacity-0 text-3xl tracking-wide mx-2 my-1"
						aria-hidden="true"
					/>

					{initialWords.map((word, id) => {
						const isActive = id === currWordIndex

						return (
							<div
								key={id}
								ref={isActive ? activeWord : null}
								id="resetableDiv"
								className="text-3xl text-stone-500 dark:text-neutral-500 tracking-wide mx-2 mb-1 inline-block relative"
							>
								{isActive ? (
									<span
										ref={cursorRef}
										className={`absolute ml-[-10px] select-none text-purple-700 text-4xl bottom-0 ${
											isBlinking ? "blink" : ""
										}`}
									>
										|
									</span>
								) : null}
								{word.split("").map((letter, key) => {
									return (
										<span
											id="resetable"
											key={key}
											ref={
												isActive && typedWord.length - 1 === key
													? activeLetter
													: null
											}
											className="mx-0"
										>
											{letter}
										</span>
									)
								})}
								{isActive
									? extraLetters.map((char, charId) => (
											<span key={charId} className="text-red-500">
												{char}
											</span>
									  ))
									: typedWords[id]
									? typedWords[id]
											.slice(initialWords[id].length)
											.split("")
											.map((char, charId) => (
												<span
													key={charId}
													className="text-red-500"
												>
													{char}
												</span>
											))
									: null}
							</div>
						)
					})}
				</div>
			</div>
			<VscDebugRestart
				onClick={Restart}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="w-8 h-8 text-stone-400 dark:text-neutral-600 hover:text-stone-500 hover:dark:text-neutral-500 transition-all duration-200 ease-in-out mx-auto mt-8"
			/>
			<div
				className={`text-center text-xs tracking-widest text-stone-500 dark:text-neutral-500 transition-opacity duration-300 ease-in-out ${
					isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				Restart Test
			</div>
		</div>
	)
}

export default Main
