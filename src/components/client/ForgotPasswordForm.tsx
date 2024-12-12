"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import validator from "validator"

const ForgotPasswordForm = () => {
	const [error, setError] = useState("")
	const [OTPInputVisible, setOtpInputVisible] = useState(false)
	const [otpVerified, setOtpVerified] = useState(false)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		otp: "",
		confirmPassword: "",
	})
	const router = useRouter()

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

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const {email, password, confirmPassword} = formData

		// Validate inputs
		if (!email || !password || !confirmPassword) {
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
			const res = await fetch(`/api/auth/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({...formData}),
				credentials: "include",
			})

			const data = await res.json()
			if (!res.ok) {
				setError(data.msg || "Failed to update profile.")
			} else {
				alert("Password Reset Successfull")
				router.push("/login")
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.")
			console.error("Signup error:", err)
		}
	}

	return (
		<div>
			<div className="flex-col items-center justify-center h-dvh">
				<form
					onSubmit={handleFormSubmit}
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

				<div className="flex justify-center items-center">
					{error && <p className="text-red-500 mx-auto">{error}</p>}
				</div>
				<div className="flex justify-center items-center">
					{OTPInputVisible && !otpVerified && <p className="text-green-500 mx-auto">OTP sent successfully</p>}
				</div>
				<div className="flex justify-center items-center">
					{otpVerified && <p className="text-green-500 mx-auto">OTP verified successfully</p>}
				</div>
			</div>
		</div>
	)
}

export {ForgotPasswordForm}
