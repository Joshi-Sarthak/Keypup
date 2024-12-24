import { create } from "zustand"

type timestore = {
	timer: number
	setTime: (time: number) => void
	decrementTime: () => void
	incrementTime: () => void
}

export const useTimeStore = create<timestore>((set) => ({
	timer: 300,
	setTime: (timer: number) => {
		set({ timer })
	},
	decrementTime: () => {
		set((state) => ({ timer: state.timer - 1 }))
	},
	incrementTime: () => {
		set((state) => ({ timer: state.timer + 1 }))
	},
}))
