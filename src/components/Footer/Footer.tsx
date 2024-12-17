"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

function Footer() {

	return (
		<footer className="flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 dark:bg-stone-800 transition-all duration-1000 mt-0 mb-0 py-6 px-8">
			<div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
                <Link href="/">
				<div className="font-normal text-xl text-stone-300 dark:text-neutral-600 ml-[-10px] transition-all duration-200 group-hover:text-stone-800 dark:group-hover:text-neutral-100">
					Keypup
				</div>
                </Link>

				{/* Links and Contact */}
				<div className="flex items-center text-sm gap-6">
					<a href="#" className="font-light text-stone-300 dark:text-neutral-600 hover:text-neutral-300 transition-all duration-200">
						About
					</a>
					<a
						href="mailto:keypup.service@gmail.com"
						className="font-light text-stone-300 dark:text-neutral-600 hover:text-neutral-300 transition-all duration-200"
					>
						Contact - keypup.service@gmail.com
					</a>
				</div>
			</div>

			{/* Divider */}
			<hr className="w-full max-w-7xl dark:border-neutral-700 my-2" />

			{/* Copyright */}
			<div className=" font-light text-xs text-stone-300 dark:text-neutral-600">
				&copy; 2024 Keypup<span>™</span>. All Rights Reserved.
			</div>
		</footer>
	)
}

export default Footer
