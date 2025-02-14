"use server"

import { prisma } from "@/lib/utils"
import { signOut } from "@/auth"

export const DeleteAccount = async (email: string) => {
	try {
		// Delete user from the database
		await prisma.user.delete({
			where: { email },
		})

		// Sign the user out
		await signOut()
	} catch (error) {
		console.error("Error deleting account:", error)
	}
}
