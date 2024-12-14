"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Logo from "../../../public/logo_purple.svg"
import LeaderboardIcon from "@mui/icons-material/Leaderboard"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import Link from "next/link"

function Navbar() {
	const [darkMode, setDarkMode] = useState(() => {
		// Check localStorage for theme on initial render
		if (typeof window !== "undefined") {
			// Explicitly get the stored theme or default to light
			const storedTheme = localStorage.getItem("theme")
			return storedTheme === "dark"
		}
		return true // Default to light mode if no theme is stored
	})

	useEffect(() => {
		// Ensure this only runs on client-side
		if (typeof window !== "undefined") {
			// Apply the correct theme based on the state
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

	return (
		<nav className="flex flex-row items-center justify-between py-4 px-16">
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
							<LightModeIcon className="text-neutral-500 group-hover:text-neutral-100 transition-all duration-200" />
						) : (
							<DarkModeIcon className="text-stone-500 group-hover:text-stone-800 transition-all duration-200" />
						)}
						<span className="ml-2 text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200">
							Theme
						</span>
					</li>
					<Link href="/leaderboard">
						<li className="group ml-4 flex items-center transition-all duration-200">
							<LeaderboardIcon className="text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200" />
							<span className="ml-2 text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200">
								Leaderboards
							</span>
						</li>
					</Link>
					<Link href="/profile">
						<li className="group ml-4 flex items-center transition-all duration-200">
							<AccountCircleIcon className="text-stone-500 dark:text-neutral-500 group-hover:text-stone-800 dark:group-hover:text-neutral-100 transition-all duration-200" />
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
