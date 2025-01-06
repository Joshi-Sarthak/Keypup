import { create } from "zustand"

type multiplayerstore = {
	isMultiplayer: boolean
	isHost: boolean
	setisHost: (isHost: boolean) => void
	setisMultiplayer: (isMultiplayer: boolean) => void
}

export const useMultiplayerstore = create<multiplayerstore>((set) => ({
	isHost: false,
	isMultiplayer: false,
	setisHost(isHost) {
		set({ isHost })
	},
	setisMultiplayer(isMultiplayer) {
		set({ isMultiplayer })
	},
}))
