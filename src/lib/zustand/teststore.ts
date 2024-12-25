import { create } from "zustand"
import english from "@/lib/Languages/english.json"
import quotesData from "@/lib/Languages/quotes.json"
import { useGamesStore } from "./gamestore"

type quote = "small" | "medium" | "large" | "xl" | null

type testStore = {
	initialWords: string[]
	typedWords: string[]
	currWord: string
	typedWord: string
	currWordIndex: number
	correctChars: number
	seedWords: (totalWords: number) => void
	seedQuotes: (quoteType: quote) => void
	setChar: (typedWordandChar: string) => void
	changeWord: () => void
	reset: () => void
	loadResult: boolean
	setLoadResult: (loadResult: boolean) => void
	correctCharsForEachSecond: number[]
}

export const useTestStore = create<testStore>((set) => ({
	initialWords: [],
	typedWords: [],
	currWord: "",
	typedWord: "",
	currWordIndex: 0,
	correctChars: 0,
	loadResult: false,
	correctCharsForEachSecond: [],

	setLoadResult: (loadResult) => {
		set({ loadResult })
	},

	seedWords: (totalWords: number) => {
		const { words } = english
		const seedWords = []
		for (let i = 0; i < totalWords; i++) {
			const index = Math.floor(Math.random() * words.length)
			seedWords.push(words[index])
		}
		set({ initialWords: seedWords, currWord: seedWords[0] })
	},

	seedQuotes: (quoteType: quote) => {
		const seedArr: string[] = []
		console.log("quoteType")

		while (true) {
			const index = Math.floor(Math.random() * quotesData.quotes.length)
			const quote = quotesData.quotes[index]

			if (
				(quoteType === "small" && quote.length <= 100) ||
				(quoteType === "medium" && quote.length <= 300) ||
				(quoteType === "large" && quote.length <= 600) ||
				(quoteType === "xl" && quote.length > 600)
			) {
				const words = quote.text.split(" ")
				seedArr.push(...words)
				break
			}
		}

		set({
			initialWords: seedArr,
			currWord: seedArr[0],
		})
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
		for (let i = 0; i < useGamesStore.getState().totalWords!; i++) {
			const index = Math.floor(Math.random() * words.length)
			seedWords.push(words[index])
		}
		set({
			initialWords: seedWords,
			typedWords: [],
			currWord: seedWords[0],
			typedWord: "",
			currWordIndex: 0,
			correctChars: 0,
			correctCharsForEachSecond: [],
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
