import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	image: { type: String },
	password: { type: String },
	googleId: { type: String },
	allResults: {
		type: [
			{
				type: { type: String, required: true },
				subType: { type: String, required: true },
				wpm: { type: Number, required: true },
			},
		],
		default: [],
	},
	recentResult: {
		type: [
			{
				type: { type: String, required: true },
				subType: { type: String, required: true },
				wpm: { type: Number, required: true },
			},
		],
		default: [],
	},
	multiplayerResults: {
		type: [
			{
				wins: { type: Number, required: true },
				losses: { type: Number, required: true },
				averageWPM: { type: Number, required: true },
			},
		],
		default: [],
	},
})

export const User = mongoose.models?.User || mongoose.model("User", userSchema)
