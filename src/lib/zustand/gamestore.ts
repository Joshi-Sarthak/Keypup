import { create } from "zustand"

type quote = "small" | "medium" | "large" | null

type gamesStore = {
	punctuation: boolean
	numbers: boolean
	quotes: boolean
	words: boolean
	time: boolean
	totalWords: number | null
	totalTime: number | null
	quotesType: quote
	setPunctuation: (punctuation: boolean) => void
	setNumbers: (numbers: boolean) => void
	setQuotes: (quotes: boolean, quotesType: quote) => void
	setWords: (words: boolean, totalWords: number | null) => void
	setTime: (time: boolean, totalTime: number | null) => void
}

export const useGamesStore = create<gamesStore>((set) => ({
	punctuation: false,
	numbers: false,
	quotes: false,
	words: false,
	time: true,
	totalWords: 50,
	totalTime: 15,
	quotesType: null,
	setPunctuation: (punctuation) => set({ punctuation }),
	setNumbers: (numbers) => set({ numbers }),
	setQuotes: (quotes, quotesType) =>
		set({
			quotes,
			quotesType,
			words: false,
			time: false,
			totalWords: null,
			totalTime: null,
			punctuation: false,
			numbers: false,
		}),
	setWords: (words, totalWords) =>
		set({
			words,
			totalWords,
			time: false,
			quotes: false,
			totalTime: null,
			quotesType: null,
		}),
	setTime: (time, totalTime) =>
		set({
			time,
			totalTime,
			totalWords: 100,
			words: false,
			quotes: false,
			quotesType: null,
		}),
}))
