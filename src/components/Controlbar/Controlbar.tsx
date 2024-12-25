"use client"

import React, { use, useState } from "react"
import { FaA } from "react-icons/fa6"
import { FaRegClock } from "react-icons/fa"
import { BiSolidQuoteAltLeft } from "react-icons/bi"
import { useGamesStore } from "@/lib/zustand/gamestore"
import { useTimeStore } from "@/lib/zustand/timestore"
import { useTestStore } from "@/lib/zustand/teststore"

function Controlbar() {
	const [selected, setSelected] = useState<string | number>(15)

	const { setQuotes, setWords, setTime, quotes, words, time } = useGamesStore(
		(state) => state
	)

	const handleClick = (size: string | number) => {
		setSelected(size)
	}

	return (
		<div className="w-1/3 h-14 p-2 mx-auto flex justify-between items-center mt-16 bg-neutral-200 dark:bg-[#242120] rounded-full border border-stone-400 dark:border-neutral-700 text-stone-400 dark:text-neutral-600">
			<ul className="flex flex-row font-semibold">
				<li
					className="ml-8 flex flex-row mr-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setSelected("small")
						setQuotes(true, "small")
						useTimeStore.getState().setIsTimerRunning(false)
						useTimeStore.getState().setTime(0)
						useTestStore.getState().reset()
					}}
					style={{
						color: quotes ? "#7e22ce" : "",
						transition: "color 0.3s ease-in-out",
					}}
				>
					<BiSolidQuoteAltLeft className="w-5 h-5 mr-2" />
					<span>Quotes</span>
				</li>
				<li
					className="flex flex-row mx-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setWords(true, 10)
						useTimeStore.getState().setIsTimerRunning(false)
						useTimeStore.getState().setTime(0)
						useTestStore.getState().reset()
						setSelected(10)
					}}
					style={{
						color: words ? "#7e22ce" : "",
						transition: "color 0.3s ease-in-out",
					}}
				>
					<FaA className="w-4 h-4 mr-2" />
					<span>Words</span>
				</li>
				<li
					className="flex flex-row ml-4 items-center hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
					onClick={() => {
						setTime(true, 15)
						useTimeStore.getState().setTime(15)
						setSelected(15)
					}}
					style={{
						color: time ? "#7e22ce" : "",
						transition: "color 0.3s ease-in-out",
					}}
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
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().seedQuotes("small")
						}}
						style={{
							color: selected === "small" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						Small
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick("medium")
							setQuotes(true, "medium")
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
							useTestStore.getState().seedQuotes("medium")
						}}
						style={{
							color: selected === "medium" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						Medium
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick("large")
							setQuotes(true, "large")
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
							useTestStore.getState().seedQuotes("large")
						}}
						style={{
							color: selected === "large" ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
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
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 10 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						10
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(25)
							setWords(true, 25)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 25 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						25
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(50)
							setWords(true, 50)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 50 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						50
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(100)
							setWords(true, 100)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(0)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 100 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
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
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(15)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 15 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						15
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(30)
							setTime(true, 30)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(30)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 30 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						30
					</li>
					<li
						className="mx-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(60)
							setTime(true, 60)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(60)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 60 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						60
					</li>
					<li
						className="mr-8 ml-4 hover:text-stone-500 hover:dark:text-neutral-500 cursor-pointer transition-all duration-300"
						onClick={() => {
							handleClick(120)
							setTime(true, 120)
							useTimeStore.getState().setIsTimerRunning(false)
							useTimeStore.getState().setTime(120)
							useTestStore.getState().reset()
						}}
						style={{
							color: selected === 120 ? "#7e22ce" : "",
							transition: "color 0.3s ease-in-out",
						}}
					>
						120
					</li>
				</ul>
			)}
		</div>
	)
}

export default Controlbar
