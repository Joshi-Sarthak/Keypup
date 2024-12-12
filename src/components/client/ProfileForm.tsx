"use client"

import validator from "validator"
import {useEffect, useState} from "react"
import {SignOut} from "@/actions/signout"
import {getUser} from "@/lib/getUser"
import {DeleteAccount} from "@/actions/deleteAccount"
import {User} from "next-auth"
import bcryptjs from "bcryptjs"

const ProfileForm = ({email}: { email: string}) => {
	const [user, setUser] = useState({
		name: "",
		email: "",
	})
	const [success, setSuccess] = useState(false)
	const [updatingPassword, setUpdatingPassword] = useState(false)
	const [error, setError] = useState("")
	const [formData, setFormData] = useState({
		username:"",
		email,
		password: "",
	})

	const getUserData = async () => {
		setError("") // Clear any previous errors
		try {
			const userData = (await getUser()) as User
			const res = await fetch(`/api/user`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			})

			if (!res.ok) {
				throw new Error("Failed to fetch user data")
			}

			const user = await res.json()
			console.log(user)
			setUser({name: user.name, email: userData.email as string})
		} catch (err) {
			console.error("Error fetching user data:", err)
			setError("Failed to load user data. Please try again.")
		}
	}

	useEffect(() => {
		getUserData()
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({...formData, [e.target.id]: e.target.value})
		checkForm(e)
		setSuccess(false)
	}

	const checkForm = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.id === "username") {
			if (e.target.value === "") {
				setError("Username cannot be empty")
			} else if (error === "Username cannot be empty") {
				setError("")
			}
		}
		if (e.target.id === "password") {
			if (e.target.value === "") {
				setError("")
				setUpdatingPassword(false)
			} else {
				setUpdatingPassword(true)
			}
			if (error === "Username cannot be empty") {
				setError("")
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("") // Clear any previous errors
		setSuccess(false)
		if (formData.username === "" && updatingPassword && formData.password === "") {
			setError("Please fill in all required fields.")
			return
		}

		if (updatingPassword && !validator.isStrongPassword(formData.password)) {
			return setError("Please enter a strong password")
		}

		try {
			const res = await fetch(`/api/userData`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const data = await res.json()
			if (!res.ok) {
				setError(data.msg || "Failed to update profile.")
			} else {
				console.log(formData, data.name)
				if(!formData.username && !formData.password){
					setError("No change in profile were made")
					return
				}
				if (data.name === formData.username) {
					if (formData.password !== "") {
						const match = await bcryptjs.compare(
							formData.password,
							data.password
						)
						console.log(match)
						if (match) {
							setError("New password cannot be same as old password")
							return
						}
					} else {
						setError("No change in profile were made")
						return
					}
				}
			}
		} catch (err) {
			console.error("Profile update error:", err)
			setError("An unexpected error occurred. Please try again.")
		}

		try {
			const res = await fetch(`/api/userProfile`, {
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
				setSuccess(true)
				console.log("Profile updated successfully")
				getUserData() 
			}
		} catch (err) {
			console.error("Profile update error:", err)
			setError("An unexpected error occurred. Please try again.")
		}
	}

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					defaultValue={user.name}
					id="username"
					placeholder="Username"
					className="bg-slate-100 text-gray-700 rounded-lg p-3"
					onChange={handleChange}
				/>
				<input
					disabled={true}
					type="email"
					defaultValue={user.email}
					id="email"
					placeholder="Email"
					className="bg-slate-100 text-gray-700 rounded-lg p-3"
				/>
				<input
					type="password"
					id="password"
					placeholder="Password"
					className="bg-slate-100 text-gray-700 rounded-lg p-3"
					onChange={handleChange}
				/>
				<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					Update
				</button>
			</form>

			<div className="flex justify-between mt-5">
				<span
					onClick={async () => {
						try {
							await DeleteAccount(user.email)
						} catch (err) {
							setError("Failed to delete account. Please try again.")
							console.error("Delete account error:", err)
						}
					}}
					className="text-red-700 cursor-pointer"
				>
					Delete Account
				</span>
				<span
					onClick={async () => {
						try {
							await SignOut()
						} catch (err) {
							setError("Failed to sign out. Please try again.")
							console.error("Sign out error:", err)
						}
					}}
					className="text-red-700 cursor-pointer"
				>
					Sign Out
				</span>
			</div>

			{error && <p className="text-red-700 mt-5">{error}</p>}
			{success && (
				<p className="text-green-700 mt-5">Profile updated successfully</p>
			)}
		</div>
	)
}

export {ProfileForm}
