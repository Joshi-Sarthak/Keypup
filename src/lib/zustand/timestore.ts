import { create } from "zustand"

type timestore = {
	timer: number
	isTimerRunning: boolean
	setTime: (time: number) => void
	decrementTime: () => void
	incrementTime: () => void
	setIsTimerRunning: (isTimerRunning: boolean) => void
}

export const useTimeStore = create<timestore>((set) => ({
	timer: 15,
	isTimerRunning: false,
	setTime: (timer: number) => {
		set({ timer })
	},
	decrementTime: () => {
		set((state) => ({ timer: state.timer - 1 }))
	},
	incrementTime: () => {
		set((state) => ({ timer: state.timer + 1 }))
	},
	setIsTimerRunning(isTimerRunning) {
		set({ isTimerRunning })
	},
}))
