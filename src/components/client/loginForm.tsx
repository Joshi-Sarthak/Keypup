"use client"

import { useState } from "react"
import Link from "next/link"
import { credentialsLogin } from "@/actions/login"
import { useRouter } from "next/navigation"
import googleSignin from "@/google/signin"
import validator from "validator"
import GoogleIcon from "@mui/icons-material/Google"

const LoginForm = () => {
	const router = useRouter()
	const [error, setError] = useState("")

	const handleFormSubmit = async (formData: FormData) => {
		const email = formData.get("email") as string
		const password = formData.get("password") as string

		// Clear the error before validation
		setError("")

		// Check if email and password fields are filled
		if (!email || !password) {
			setError("Fields cannot be empty")
			return // Prevent form submission
		}

		if (!validator.isEmail(email)) {
			return setError("Please enter a valid email address")
		}

		// Attempt login
		const loginError = await credentialsLogin(email, password)

		if (loginError) {
			console.log(loginError)
			setError("Invalid Credentials")
		} else {
			console.log("tt")
			router.refresh()
		}
	}

	return (
		<div className="flex-col items-center justify-center h-dvh mt-2">
			<h2 className="flex justify-center tracking-widest text-3xl mb-4 text-stone-500 dark:text-neutral-500">
				LOG IN
			</h2>
			<div className="border border-b-stone-400 max-w-lg mx-auto"></div>
			<div className="flex flex-row justify-center mb-4 mt-4">
				<form action={googleSignin}>
					<button
						className="text-stone-500 py-3 px-32 rounded-2xl flex items-center tracking-wide font-semibold bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
						type="submit"
					>
						<GoogleIcon />
						<span className="ml-4">Login with Google</span>
					</button>
				</form>
			</div>
			<div className="mx-auto max-w-md flex justify-center tracking-widest text-stone-400 dark:text-neutral-600">
				OR
			</div>
			<form
				action={async (formData) => {
					await handleFormSubmit(formData)
				}}
				className="mx-auto max-w-md bg-transparent"
			>
				<div className="mb-4 mt-2">
					<label
						htmlFor="email"
						className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
					>
						Email
					</label>
					<input
						autoComplete="off"
						type="text"
						id="email"
						name="email"
						className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent"
						placeholder="Enter your email"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-stone-500 dark:text-neutral-400 text-sm font-medium mb-2 ml-2 tracking-wider"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent"
						placeholder="Enter your password"
					/>
				</div>

				<div className="flex flex-row justify-start">
					<Link
						className="text-stone-400 dark:text-neutral-400 mt-2 ml-2 hover:underline font-thin tracking-wider"
						href="/forgotpassword"
					>
						Forgot Password?
					</Link>
				</div>

				<button
					type="submit"
					className="text-stone-500 w-full mt-4 py-2 px-32 rounded-2xl flex justify-center items-center tracking-wide font-semibold bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
				>
					Sign In
				</button>
				<Link
					className="flex justify-start items-center mt-4 ml-2 text-stone-400 dark:text-neutral-400 hover:text-stone-500 hover:dark:text-neutral-300 transition-all duration-400 font-thin tracking-wider"
					href="/signup"
				>
					New to Keypup? Signup
				</Link>
			</form>

			<div className="flex flex-row justify-center items-center mt-6 tracking-wider font-thin">
				{error && <p className="text-red-500 mx-auto">{error}</p>}
			</div>
		</div>
	)
}

export { LoginForm }
