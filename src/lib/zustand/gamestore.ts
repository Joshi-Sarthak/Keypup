import { create } from "zustand"

type quote = "small" | "medium" | "large" | null

type gamesStore = {
	quotes: boolean
	words: boolean
	time: boolean
	totalWords: number | null
	totalTime: number | null
	quotesType: quote
	setQuotes: (quotes: boolean, quotesType: quote) => void
	setWords: (words: boolean, totalWords: number | null) => void
	setTime: (time: boolean, totalTime: number | null) => void
}

export const useGamesStore = create<gamesStore>((set) => ({
	quotes: false,
	words: false,
	time: true,
	totalWords: 50,
	totalTime: 15,
	quotesType: null,

	setQuotes: (quotes, quotesType) =>
		set({
			quotes,
			quotesType,
			words: false,
			time: false,
			totalWords: null,
			totalTime: null,
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
