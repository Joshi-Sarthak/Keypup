"use server"
import mongoose from "mongoose"

export const connectToDatabase = async () => {
	try {
		if (mongoose.connections && mongoose.connections[0].readyState) return

		const {connection} = await mongoose.connect(process.env.MONGO_URL as string, {
			dbName: "authjs",
		})

		console.log(`Connected to database: ${connection.host}`)
	} catch (error) {
		throw new Error(`Error connecting to database ${error}`)
	}
}
