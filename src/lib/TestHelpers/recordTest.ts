import { useTestStore } from "../zustand/teststore"

const handleBackspace = (
	activeLetter: HTMLSpanElement | null,
	activeWord: HTMLDivElement | null
) => {
	const { typedWord, currWord, currWordIndex, setChar } = useTestStore.getState()

	if (typedWord.length > 0) {
		// Handle case when the typed word matches current word
		if (useTestStore.getState().currWord === typedWord) {
			useTestStore.setState((state) => ({
				correctChars: state.correctChars - state.currWord.length - 1,
				rawChars: state.rawChars - state.currWord.length + 1,
			}))
		}

		// Reset word styling
		if (activeWord) {
			activeWord.classList.remove("correct", "wrong", "semiWrong")

			// Handle extra letters only at word level
			const lengthDiff = typedWord.length - currWord.length
			if (lengthDiff > 0) {
				useTestStore.setState((state) => ({
					extraLetters: state.extraLetters - 1,
				}))
			}
		}

		// Remove the last character from typedWord
		setChar(typedWord.slice(0, -1))

		// Reset letter styling
		if (activeLetter && activeLetter.parentElement) {
			const spanElements = activeLetter.parentElement.querySelectorAll("span")
			const lastSpan = spanElements[typedWord.length]
			if (lastSpan) {
				lastSpan.classList.remove("correct", "wrong", "semiWrong")
			}
		}
	} else if (currWordIndex > 0) {
		// Handle backspace at the beginning of a word
		useTestStore.setState((state) => ({
			correctChars: state.correctChars - 1,
			rawChars: state.rawChars + 1,
		}))

		const prevWordIndex = currWordIndex - 1

		useTestStore.setState((state) => ({
			currWordIndex: prevWordIndex,
			typedWord: state.typedWords[prevWordIndex] || "",
			typedWords: state.typedWords.slice(0, -1),
			currWord: state.initialWords[prevWordIndex],
		}))
	}

	// Reset active letter styling
	if (activeLetter) {
		activeLetter.classList.remove("correct", "wrong", "semiWrong")
	}
}

const handleSpace = (
	activeWord: HTMLDivElement | null,
	typedWord: string,
	currWord: string
) => {
	if (typedWord === "") return

	// Update raw character count
	useTestStore.setState((state) => ({
		rawChars: state.rawChars + typedWord.length + 1,
	}))

	// Handle word completion
	if (activeWord) {
		if (currWord !== typedWord) {
			activeWord.classList.add("semiWrong")
		} else {
			useTestStore.setState((state) => ({
				correctChars: state.correctChars + currWord.length + 1,
			}))
		}
	}

	// Calculate and update extra/missing letters
	const lengthDiff = typedWord.length - currWord.length
	if (lengthDiff > 0) {
		useTestStore.setState((state) => ({
			extraLetters: state.extraLetters + lengthDiff,
		}))
	} else if (lengthDiff < 0) {
		useTestStore.setState((state) => ({
			missingLetters: state.missingLetters + Math.abs(lengthDiff),
		}))
	}

	// Move to next word
	useTestStore.getState().changeWord()
}

export const RecordTest = (
	key: string,
	activeLetter: HTMLSpanElement | null,
	activeWord: HTMLDivElement | null
) => {
	const { setChar, typedWord, currWord } = useTestStore.getState()

	switch (key) {
		case "Backspace":
			handleBackspace(activeLetter, activeWord)
			break

		case " ":
			handleSpace(activeWord, typedWord, currWord)
			break

		default:
			setChar(typedWord + key)
			break
	}
}
