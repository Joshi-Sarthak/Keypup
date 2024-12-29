import { create } from "zustand"
import english from "@/lib/Languages/english.json"
import quotesData from "@/lib/Languages/quotes.json"
import { useGamesStore } from "./gamestore"

type quote = "small" | "medium" | "large" | null

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
	rawCharsForEachSecond: number[]
	rawChars: number
	inaccuracies: number
	extraLetters: number
	missingLetters: number
	correctLetters: number
}

export const useTestStore = create<testStore>((set) => ({
	initialWords: [],
	typedWords: [],
	currWord: "",
	typedWord: "",
	currWordIndex: 0,
	correctChars: 0,
	loadResult: false,
	inaccuracies: 0,
	correctCharsForEachSecond: [],
	rawCharsForEachSecond: [],
	rawChars: 0,
	extraLetters: 0,
	missingLetters: 0,
	correctLetters: 0,

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

		while (true) {
			const index = Math.floor(Math.random() * quotesData.quotes.length)
			const quote = quotesData.quotes[index]

			if (quoteType === "small" && quote.length <= 150) {
				const words = quote.text.split(" ")
				seedArr.push(...words)
				break
			} else if (
				quoteType === "medium" &&
				quote.length <= 300 &&
				quote.length > 150
			) {
				const words = quote.text.split(" ")
				seedArr.push(...words)
				break
			} else if (quoteType === "large" && quote.length > 300) {
				const words = quote.text.split(" ")
				seedArr.push(...words)
				break
			}
		}
		useGamesStore.getState().totalWords = seedArr.length

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
		if (!useGamesStore.getState().quotes) {
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
				rawCharsForEachSecond: [],
				rawChars: 0,
				correctLetters: 0,
				loadResult: false,
				extraLetters: 0,
			})
		} else {
			const seedArr: string[] = []
			while (true) {
				const index = Math.floor(Math.random() * quotesData.quotes.length)
				const quote = quotesData.quotes[index]

				if (
					useGamesStore.getState().quotesType === "small" &&
					quote.length <= 150
				) {
					const words = quote.text.split(" ")
					seedArr.push(...words)
					break
				} else if (
					useGamesStore.getState().quotesType &&
					quote.length <= 300 &&
					quote.length > 150
				) {
					const words = quote.text.split(" ")
					seedArr.push(...words)
					break
				} else if (useGamesStore.getState().quotesType && quote.length > 300) {
					const words = quote.text.split(" ")
					seedArr.push(...words)
					break
				}
			}
			set({
				initialWords: seedArr,
				typedWords: [],
				currWord: seedArr[0],
				typedWord: "",
				currWordIndex: 0,
				correctChars: 0,
				correctLetters: 0,
				correctCharsForEachSecond: [],
				rawCharsForEachSecond: [],
				rawChars: 0,
				extraLetters: 0,
			})
		}

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
