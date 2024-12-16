"use client"

import { useState } from "react"
import Link from "next/link"
import { credentialsSignup } from "@/actions/Signup"
import { useRouter } from "next/navigation"
import googleSignin from "@/google/signin"
import validator from "validator"
import { FaGoogle } from "react-icons/fa"

const SignupForm = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		otp: "",
		confirmPassword: "",
	})
	const [error, setError] = useState("")
	const [OTPInputVisible, setOtpInputVisible] = useState(false)
	const [otpVerified, setOtpVerified] = useState(false)
	const router = useRouter()

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const { username, email, password, confirmPassword } = formData

		// Validate inputs
		if (!username || !email || !password || !confirmPassword) {
			console.log(formData)
			setError("Please fill out all fields.")
			return
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.")
			return
		}

		if (!otpVerified) {
			setError("Please verify your OTP before signing up.")
			return
		}

		if (!validator.isEmail(email)) {
			return setError("Please enter a valid email address")
		}

		if (!validator.isStrongPassword(password)) {
			return setError("Please enter a strong password")
		}

		try {
			// Attempt Signup
			const signupError = await credentialsSignup(username, email, password)

			if (signupError) {
				setError(signupError)
			} else {
				router.push("/login")
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.")
			console.error("Signup error:", err)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })
		if (e.target.id === "email" && validator.isEmail(formData.email)) {
			return setError("")
		}
		if (e.target.id === "email" && !validator.isEmail(formData.email)) {
			return setError("Please enter a valid email address")
		}
	}

	const sendOtp = async () => {
		setError("") // Clear previous errors
		if (!validator.isEmail(formData.email)) {
			return setError("Please enter a valid email address")
		}
		try {
			const res = await fetch(`/api/auth/send-otp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: formData.email }),
				credentials: "include",
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.msg || "Failed to send OTP, please try again.")
			} else {
				setOtpInputVisible(true)
			}
		} catch (err) {
			setError("Failed to send OTP, please try again.")
			console.error("OTP send error:", err)
		}
	}

	const verifyOtp = async () => {
		setError("") // Clear previous errors
		try {
			const res = await fetch(`/api/auth/verify-otp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: formData.email, otp: formData.otp }),
				credentials: "include",
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.msg || "Incorrect OTP, please try again.")
			} else {
				setOtpVerified(true)
			}
		} catch (err) {
			setError("Incorrect OTP, please try again.")
			console.error("OTP verification error:", err)
		}
	}

	return (
		<div className="flex-col items-center justify-center h-dvh">
			<h2 className="flex justify-center tracking-widest text-3xl mb-4 text-stone-500 dark:text-neutral-500">
				SIGN UP
			</h2>
			<div className="border border-b-stone-400 max-w-lg mx-auto"></div>
			<form
				action={googleSignin}
				className="flex flex-row justify-center mb-4 mt-4"
			>
				<button
					className="text-stone-500 py-3 px-32 rounded-2xl flex items-center tracking-wide font-semibold bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
					type="submit"
				>
					<FaGoogle />
					<span className="ml-4">Signup with Google</span>
				</button>
			</form>
			<div className="mx-auto max-w-md flex justify-center tracking-widest text-stone-400 dark:text-neutral-600">
				OR
			</div>
			<form
				onSubmit={handleFormSubmit}
				className="mx-auto max-w-md bg-transparent"
			>
				<div className="mb-4 mt-2">
					<label
						htmlFor="username"
						className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
					>
						Name
					</label>
					<input
						onChange={handleChange}
						autoComplete="off"
						type="text"
						id="username"
						name="username"
						className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent"
						placeholder="Enter your Name"
					/>
				</div>

				<div className="relative">
					<label
						htmlFor="email"
						className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
					>
						Email
					</label>
					<div className="relative mb-4">
						<input
							onChange={handleChange}
							autoComplete="off"
							type="email"
							id="email"
							name="email"
							className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent pr-[110px]"
							placeholder="Enter your email"
						/>
						<button
							type="button"
							onClick={sendOtp}
							className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-cente bg-transparent text-stone-500 dark:text-neutral-400 font-thin h-[calc(100%)] px-4 hover:text-stone-800 hover:dark:text-neutral-100 hover:bg-neutral-400 hover:dark:bg-neutral-700 hover:rounded-r-2xl transition-all duration-200"
						>
							Send OTP
						</button>
					</div>
				</div>
				<div className="flex justify-center items-center">
					{OTPInputVisible && !otpVerified && (
						<p className="text-green-500 mx-auto font-thin">
							OTP sent successfully
						</p>
					)}
				</div>

				{OTPInputVisible && (
					<>
						<div className="relative">
							<label
								htmlFor="otp"
								className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
							>
								OTP
							</label>
							<div className="relative mb-4">
								<input
									onChange={handleChange}
									type="text"
									id="otp"
									name="otp"
									className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent pr-[120px]"
									placeholder="Enter your OTP"
								/>
								<button
									type="button"
									onClick={verifyOtp}
									className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-cente bg-transparent text-stone-500 dark:text-neutral-400 font-thin h-[calc(100%)] px-4 hover:text-stone-800 hover:dark:text-neutral-100 hover:bg-neutral-400 hover:dark:bg-neutral-700 hover:rounded-r-2xl transition-all duration-200"
								>
									Verify OTP
								</button>
							</div>
						</div>
						<div className="flex justify-center items-center">
							{otpVerified && (
								<p className="text-green-500 mx-auto font-thin">
									OTP verified successfully
								</p>
							)}
						</div>
					</>
				)}

				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
					>
						Password
					</label>
					<input
						onChange={handleChange}
						type="password"
						id="password"
						name="password"
						className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent"
						placeholder="Enter your password"
					/>
				</div>

				<div className="">
					<label
						htmlFor="confirmpassword"
						className="block text-stone-500 dark:text-neutral-400 font-medium text-sm mb-2 ml-2 tracking-wider"
					>
						Confirm Password
					</label>
					<input
						onChange={handleChange}
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						className="w-full text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent"
						placeholder="Enter your password again"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="text-stone-500 w-full mt-6 py-2 px-32 rounded-2xl flex justify-center items-center tracking-wide font-semibold bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
					>
						Sign Up
					</button>
				</div>
				<Link
					className="flex justify-start items-center mt-4 ml-2 text-stone-400 dark:text-neutral-400 hover:text-stone-500 hover:dark:text-neutral-300 transition-all duration-400 font-thin tracking-wider"
					href="/login"
				>
					<p>Already on Keypup? Login</p>
				</Link>
			</form>

			<div className="flex flex-row justify-center items-center mt-2 tracking-wider font-thin">
				{error && <p className="text-red-500 mx-auto">{error}</p>}
			</div>
		</div>
	)
}

export { SignupForm }
