import { create } from "zustand"
import english from "@/lib/Languages/english.json"

type testStore = {
	initialWords: string[]
	typedWords: string[]
	currWord: string
	typedWord: string
	currWordIndex: number
	correctChars: number
	seedWords: () => void
	setChar: (typedWordandChar: string) => void
	changeWord: () => void
	reset: () => void
}

export const useTestStore = create<testStore>((set) => ({
	initialWords: [],
	typedWords: [],
	currWord: "",
	typedWord: "",
	currWordIndex: 0,
	correctChars: 0,

	seedWords: () => {
		const { words } = english
		const seedWords = []
		for (let i = 0; i < 200; i++) {
			const index = Math.floor(Math.random() * words.length)
			seedWords.push(words[index])
		}
		set({ initialWords: seedWords, currWord: seedWords[0] })
	},

	setChar: (typedWordandChar) => {
		set({ typedWord: typedWordandChar })
	},

	changeWord: () => {
		set((state) => {
			const nextIndex = state.typedWords.length + 1
			return {
				typedWords: [...state.typedWords, state.typedWord.trim()],
				typedWord: "",
				currWord: state.initialWords[nextIndex] || "",
				currWordIndex: state.currWordIndex + 1,
			}
		})
	},

	// Reset function
	reset: () => {
		const { words } = english
		const seedWords = []
		for (let i = 0; i < 200; i++) {
			const index = Math.floor(Math.random() * words.length)
			seedWords.push(words[index])
		}
		set({
			initialWords: seedWords,
			typedWords: [],
			currWord: seedWords[0],
			typedWord: "",
			currWordIndex: 0,
		})

		const resetableSpans = document.querySelectorAll("#resetable")
		const resetableDivs = document.querySelectorAll("#resetableDiv")
		resetableSpans.forEach((span) => {
			span.classList.remove("correct", "wrong", "semiWrong")
		})
		resetableDivs.forEach((div) => {
			div.classList.remove("correct", "wrong", "semiWrong")
		})
	},
}))
