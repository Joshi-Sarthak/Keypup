import { create } from "zustand"

type multiplayerstore = {
	isMultiplayer: boolean
	isHost: boolean
	mode : string
	subType : string
	setisHost: (isHost: boolean) => void
	setisMultiplayer: (isMultiplayer: boolean) => void
}

export const useMultiplayerstore = create<multiplayerstore>((set) => ({
	isHost: false,
	isMultiplayer: false,
	mode : "time",
	subType : "15",
	setisHost(isHost) {
		set({ isHost })
	},
	setisMultiplayer(isMultiplayer) {
		set({ isMultiplayer })
	},
}))
