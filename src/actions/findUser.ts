"use server"

import { prisma } from "@/lib/utils"

export const findUser = async (email: string) => {
	try {
		// Find the user by email
		const user = await prisma.user.findUnique({
			where: { email },
		})

		console.log(user)
		return user
	} catch (error) {
		console.error("Error fetching user:", error)
		return null
	}
}
