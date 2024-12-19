"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Logo from "../../../public/logo_purple.svg"
import { MdLeaderboard } from "react-icons/md"
import { MdAccountCircle } from "react-icons/md"
import { MdOutlineLightMode } from "react-icons/md"
import { MdOutlineDarkMode } from "react-icons/md"
import Link from "next/link"

function Navbar() {
	const [darkMode, setDarkMode] = useState<boolean | null>(null) // Start with null

	useEffect(() => {
		// This will run only in the browser
		const storedTheme = localStorage.getItem("theme")
		setDarkMode(storedTheme === "dark") // Update darkMode state after checking localStorage
	}, [])

	useEffect(() => {
		if (darkMode !== null) {
			// Apply theme only when darkMode is not null
			if (darkMode) {
				document.documentElement.classList.add("dark")
				localStorage.setItem("theme", "dark")
			} else {
				document.documentElement.classList.remove("dark")
				localStorage.setItem("theme", "light")
			}
		}
	}, [darkMode])

	const toggleTheme = () => {
		setDarkMode((prevMode) => !prevMode)
	}

	if (darkMode === null) return null

	return (
		<nav className="flex flex-row items-center justify-between pt-2 px-16">
			<Link href="/">
				<div className="group flex flex-row items-center">
					<Image
						src={Logo}
						alt="Logo"
						width={75}
						height={75}
						className="transition-all duration-200 group-hover:scale-105"
					/>
					<h2 className="font-medium text-3xl text-stone-700 dark:text-neutral-400 ml-[-10px] transition-all duration-200 group-hover:text-stone-800 dark:group-hover:text-neutral-100">
						Keypup
					</h2>
				</div>
			</Link>
			<div>
				<ul className="flex flex-row items-center font-light">
					<li
						onClick={toggleTheme}
						className="group cursor-pointer flex items-center transition-all duration-200"
					>
						{darkMode ? (
							<MdOutlineLightMode
								className="text-neutral-500 group-hover:text-neutral-100 transition-all duration-200"
								size={25}
							/>
						) : (
							<MdOutlineDarkMode
								className="text-stone-500 group-hover:text-stone-800 transition-all duration-200"
								size={25}
							/>
						)}
						<span className="ml-2 text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200">
							Theme
						</span>
					</li>
					<Link href="/leaderboard">
						<li className="group ml-4 flex items-center transition-all duration-200">
							<MdLeaderboard
								className="text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200"
								size={25}
							/>
							<span className="ml-2 text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200">
								Leaderboards
							</span>
						</li>
					</Link>
					<Link href="/profile">
						<li className="group ml-4 flex items-center transition-all duration-200">
							<MdAccountCircle
								className="text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200"
								size={25}
							/>
							<span className="ml-2 text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200">
								Profile
							</span>
						</li>
					</Link>
				</ul>
			</div>
		</nav>
	)
}

export default Navbar
