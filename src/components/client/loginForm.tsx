"use client"

import {useState} from "react"
import Link from "next/link"
import {credentialsLogin} from "@/actions/login"
import {useRouter} from "next/navigation"
import googleSignin from "@/google/signin"
import validator from "validator"

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
		<div
			className="flex-col
     items-center justify-center h-dvh"
		>
			<form
				action={async (formData) => {
					await handleFormSubmit(formData)
				}}
				className="mx-auto my-10 border-2 max-w-sm bg-slate-300 p-6"
			>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Email
					</label>
					<input
						autoComplete="off"
						type="email"
						id="email"
						name="email"
						className="w-full text-gray-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your email"
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="password"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="w-full text-gray-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your password"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
					>
						Sign In
					</button>
					<Link className="text-blue-500" href="/forgotpassword">
						<p>Forgot Password</p>
					</Link>
				</div>
			</form>

			<form action={googleSignin} className="flex">
				<button
					className="bg-blue-500 text-white font-bold my-2 py-1 px-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
					type="submit" // Changed to button to avoid form submission
				>
					Login with Google
				</button>
			</form>

			<Link className="flex justify-center items-center" href="/signup">
				<p>Don’t have an account? Signup</p>
			</Link>

			<div className="flex justify-center items-center">
				{error && <p className="text-red-500 mx-auto">{error}</p>}
			</div>
		</div>
	)
}

export {LoginForm}
