/* eslint-disable react-hooks/exhaustive-deps */
import React, { use, useEffect, useRef, useState } from "react"
import { useTestStore } from "@/lib/zustand/teststore"
import { useTimeStore } from "@/lib/zustand/timestore"
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
	const timerStarted = useRef(false)

	const correctCharsForEachSecond = useTestStore(
		(state) => state.correctCharsForEachSecond
	)

	const activeWord = useRef<HTMLDivElement>(null)
	const activeLetter = useRef<HTMLSpanElement>(null)
	const cursorRef = useRef<HTMLSpanElement>(null)
	const measureRef = useRef<HTMLSpanElement>(null)
	const wordsContainerRef = useRef<HTMLDivElement>(null)
	let timeoutId = useRef<NodeJS.Timeout | null>(null)

	// Track correct characters typed each second
	const correctCharsPerSecond = useRef(0)

	const Restart = () => {
		setIsBlinking(false)
		timerStarted.current = false
		useTimeStore.getState().setTime(0)
		reset()
	}

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (timerStarted.current && useTimeStore.getState().time >= 0) {
			interval = setInterval(() => {
				const timeLeft = useTimeStore.getState().time

				if (timeLeft > 0) {
					useTimeStore.getState().decrementTime()
				} else {
					clearInterval(interval!)
					useTestStore.getState().setLoadResult(true)
				}
				correctCharsForEachSecond.push(correctCharsPerSecond.current)
				correctCharsPerSecond.current = 0
			}, 1000)
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [timerStarted.current])

	useEffect(() => {
		seedWords(100)
	}, [seedWords])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!timerStarted.current) {
				timerStarted.current = true
			}

			if (e.ctrlKey && e.key === "b") {
				Restart()
			} else if (e.key.length === 1 || e.key === "Backspace") {
				if (e.key === " ") {
					correctCharsPerSecond.current = correctCharsPerSecond.current + 1
				}
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
				correctCharsPerSecond.current = correctCharsPerSecond.current + 1
			} else {
				activeLetter.current?.classList.add("wrong")
			}
		}
	}, [currWord, typedWord])

	useEffect(() => {
		if (cursorRef.current && wordsContainerRef.current) {
			const container = wordsContainerRef.current
			const cursorPosition = cursorRef.current.getBoundingClientRect().top
			const containerPosition = container.getBoundingClientRect().top
			const containerHeight = container.getBoundingClientRect().height

			const cursorDistanceFromTop = cursorPosition - containerPosition
			const desiredScrollDistance = Math.max(
				0,
				cursorDistanceFromTop - (1 / 3) * containerHeight
			)

			container.scrollBy({
				top: desiredScrollDistance,
				behavior: "smooth",
			})
		}
	}, [typedWord])

	const extraLetters = typedWord.slice(currWord.length).split("")

	return (
		<div>
			<div className="flex justify-center w-full mt-28">
				<div className="w-3/4 flex flex-col">
					<span className="ml-2 text-3xl font-medium text-purple-700 mb-1 self-start">
						{useTimeStore((state) => state.time)}
					</span>
					<div
						className="w-full flex flex-wrap max-h-[120px] overflow-hidden"
						ref={wordsContainerRef}
					>
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
													isActive &&
													typedWord.length - 1 === key
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
												<span
													key={charId}
													className="text-red-500"
												>
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
