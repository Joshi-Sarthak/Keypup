"use client"

import React, { use, useState } from "react"
import { FaA } from "react-icons/fa6"
import { RiSingleQuotesR } from "react-icons/ri"
import { TbNumber1Small } from "react-icons/tb"
import { FaRegClock } from "react-icons/fa"
import { BiSolidQuoteAltLeft } from "react-icons/bi"
import { useGamesStore } from "@/lib/zustand/gamestore"

function Controlbar() {
	const [selected, setSelected] = useState<string | number>(15)

	const setPunctuation = useGamesStore((state) => state.setPunctuation)
	const setNumbers = useGamesStore((state) => state.setNumbers)
	const setQuotes = useGamesStore((state) => state.setQuotes)
	const setWords = useGamesStore((state) => state.setWords)
	const setTime = useGamesStore((state) => state.setTime)
	const punctuation = useGamesStore((state) => state.punctuation)
	const numbers = useGamesStore((state) => state.numbers)
	const quotes = useGamesStore((state) => state.quotes)
	const words = useGamesStore((state) => state.words)
	const time = useGamesStore((state) => state.time)

	const handleClick = (size: string | number) => {
		setSelected(size)
	}

	return (
		<div className="w-1/2 h-14 p-2 mx-auto flex justify-between items-center mt-16 bg-neutral-200 dark:bg-[#242120] rounded-full border border-stone-400 dark:border-neutral-700 text-stone-400 dark:text-neutral-600">
			<ul className="flex flex-row font-semibold">
				<li
					className={`flex flex-row ml-8 items-center ${
						quotes
							? "text-stone-300 dark:text-neutral-800 cursor-not-allowed"
							: "hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer"
					} transition-all duration-300`}
					onClick={() => {
						!quotes && setPunctuation(!punctuation)
					}}
					style={{ color: punctuation && !quotes ? "#7e22ce" : "" }}
				>
					<RiSingleQuotesR className="w-5 h-5 mr-1" />
					<span>Punctuation</span>
				</li>
				<li
					className={`flex flex-row ml-4 items-center ${
						quotes
							? "text-stone-300 dark:text-neutral-800 cursor-not-allowed"
							: "hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer"
					} transition-all duration-300`}
					onClick={() => {
						!quotes && setNumbers(!numbers)
					}}
					style={{ color: numbers && !quotes ? "#7e22ce" : "" }}
				>
					<TbNumber1Small className="w-8 h-8 mr-[-4px]" />
					<span>Numbers</span>
				</li>
			</ul>

			<div className="border-r-4 rounded-full border-stone-300 dark:border-stone-800 h-full"></div>
			<ul className="flex flex-row font-semibold">
				<li
					className="flex flex-row mr-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setSelected("small")
						setQuotes(true, "small")
					}}
					style={{ color: quotes ? "#7e22ce" : "" }}
				>
					<BiSolidQuoteAltLeft className="w-5 h-5 mr-2" />
					<span>Quotes</span>
				</li>
				<li
					className="flex flex-row mx-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setWords(true, 10)
						setSelected(10)
					}}
					style={{ color: words ? "#7e22ce" : "" }}
				>
					<FaA className="w-4 h-4 mr-2" />
					<span>Words</span>
				</li>
				<li
					className="flex flex-row ml-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setTime(true, 15)
						setSelected(15)
					}}
					style={{ color: time ? "#7e22ce" : "" }}
				>
					<FaRegClock className="w-4 h-4 mr-2" />
					<span>Time</span>
				</li>
			</ul>
			<div className="border-r-4 rounded-full border-stone-300 dark:border-stone-800 h-full"></div>
			{quotes && (
				<ul className="flex flex-row font-semibold">
					<li
						className="mr-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick("small")
							setQuotes(true, "small")
						}}
						style={{ color: selected === "small" ? "#7e22ce" : "" }}
					>
						Small
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick("medium")
							setQuotes(true, "medium")
						}}
						style={{ color: selected === "medium" ? "#7e22ce" : "" }}
					>
						Medium
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick("large")
							setQuotes(true, "large")
						}}
						style={{ color: selected === "large" ? "#7e22ce" : "" }}
					>
						Large
					</li>
				</ul>
			)}
			{words && (
				<ul className="flex flex-row font-semibold">
					<li
						className="mr-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(10)
							setWords(true, 10)
						}}
						style={{ color: selected === 10 ? "#7e22ce" : "" }}
					>
						10
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(25)
							setWords(true, 25)
						}}
						style={{ color: selected === 25 ? "#7e22ce" : "" }}
					>
						25
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(50)
							setWords(true, 50)
						}}
						style={{ color: selected === 50 ? "#7e22ce" : "" }}
					>
						50
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(100)
							setWords(true, 100)
						}}
						style={{ color: selected === 100 ? "#7e22ce" : "" }}
					>
						100
					</li>
				</ul>
			)}
			{time && (
				<ul className="flex flex-row font-semibold">
					<li
						className="mr-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(15)
							setTime(true, 15)
						}}
						style={{ color: selected === 15 ? "#7e22ce" : "" }}
					>
						15
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(30)
							setTime(true, 30)
						}}
						style={{ color: selected === 30 ? "#7e22ce" : "" }}
					>
						30
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(60)
							setTime(true, 60)
						}}
						style={{ color: selected === 60 ? "#7e22ce" : "" }}
					>
						60
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(120)
							setTime(true, 120)
						}}
						style={{ color: selected === 120 ? "#7e22ce" : "" }}
					>
						120
					</li>
				</ul>
			)}
		</div>
	)
}

export default Controlbar
