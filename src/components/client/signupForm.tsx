"use client"

import {useState} from "react"
import Link from "next/link"
import {credentialsSignup} from "@/actions/Signup"
import {useRouter} from "next/navigation"
import googleSignin from "@/google/signin"
import validator from "validator"

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
		const {username, email, password, confirmPassword} = formData

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
		setFormData({...formData, [e.target.id]: e.target.value})
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
				body: JSON.stringify({email: formData.email}),
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
				body: JSON.stringify({email: formData.email, otp: formData.otp}),
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
			<form
				onSubmit={handleFormSubmit}
				className="mx-auto my-10 border-2 max-w-sm bg-slate-300 p-6"
			>
				<div className="mb-6">
					<label
						htmlFor="username"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Name
					</label>
					<input
						onChange={handleChange}
						autoComplete="off"
						type="text"
						id="username"
						name="username"
						className="w-full text-slate-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your Name"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Email
					</label>
					<input
						onChange={handleChange}
						autoComplete="off"
						type="email"
						id="email"
						name="email"
						className="w-full text-slate-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your email"
					/>
				</div>

				<button
					type="button"
					onClick={sendOtp}
					className="mb-4 relative flex items-center justify-center bg-gradient-to-br group/btn bg-slate-500 w-full text-neutral-200 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
				>
					Send OTP
				</button>

				{OTPInputVisible && (
					<>
						<div className="mb-4">
							<label
								htmlFor="otp"
								className="block text-gray-700 text-sm font-bold mb-2"
							>
								OTP
							</label>
							<input
								onChange={handleChange}
								type="text"
								id="otp"
								name="otp"
								className="w-full text-slate-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your OTP"
							/>
						</div>

						<button
							type="button"
							onClick={verifyOtp}
							className="mb-4 relative flex items-center justify-center bg-gradient-to-br group/btn bg-slate-500 w-full text-neutral-200 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
						>
							Verify OTP
						</button>
					</>
				)}

				<div className="mb-6">
					<label
						htmlFor="password"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Password
					</label>
					<input
						onChange={handleChange}
						type="password"
						id="password"
						name="password"
						className="w-full text-slate-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your password"
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="confirmpassword"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Confirm Password
					</label>
					<input
						onChange={handleChange}
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						className="w-full text-slate-950 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your password again"
					/>
				</div>

				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
					>
						Sign Up
					</button>
				</div>
			</form>
			<div className="flex-col justify-center items-center">
				<form action={googleSignin} className="flex">
					<button
						className="bg-blue-500 text-white font-bold my-2 py-1 px-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
						type="submit"
					>
						Signup with Google
					</button>
				</form>
				<Link className="flex items-center justify-center" href="/login">
					<p>Already have an account? Login</p>
				</Link>
			</div>
			<div className="flex justify-center items-center">
				{error && <p className="text-red-500 mx-auto">{error}</p>}
			</div>
			<div className="flex justify-center items-center">
				{OTPInputVisible && !otpVerified && (
					<p className="text-green-500 mx-auto">OTP sent successfully</p>
				)}
			</div>
			<div className="flex justify-center items-center">
				{otpVerified && (
					<p className="text-green-500 mx-auto">OTP verified successfully</p>
				)}
			</div>
		</div>
	)
}

export {SignupForm}
