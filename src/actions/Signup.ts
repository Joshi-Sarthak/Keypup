export const runtime = "nodejs"

import { User } from "@/models/userModel"
import { hash } from "bcryptjs"
import { connectToDatabase } from "@/lib/utils"

const credentialsSignup = async (name: string, email: string, password: string) => {
	//connection db
	await connectToDatabase()

	const user = await User.findOne({ email })

	if (user) return "User already exists"

	const hashedPassword = await hash(password, 10)

	await User.create({
		name,
		email,
		password: hashedPassword,
	})

	return null
}

export { credentialsSignup }
