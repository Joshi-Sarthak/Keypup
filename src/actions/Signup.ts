"use server"
import { prisma } from "@/lib/utils"
import { hash } from "bcryptjs"

const credentialsSignup = async (name: string, email: string, password: string) => {
	try {
		// Check if the user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) return "User already exists"

		// Hash the password
		const hashedPassword = await hash(password, 10)

		// Create new user
		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

		return null
	} catch (error) {
		console.error("Error in credentialsSignup:", error)
		return "An error occurred while signing up"
	}
}

export { credentialsSignup }
