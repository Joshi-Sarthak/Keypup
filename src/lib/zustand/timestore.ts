import { create } from "zustand"

type timestore = {
	time: number
	setTime: (time: number) => void
	decrementTime: () => void
}

export const useTimeStore = create<timestore>((set) => ({
	time: 0,
	setTime: (time: number) => {
		set({ time })
	},
	decrementTime: () => {
		set((state) => ({ time: state.time - 1 }))
	},
}))
