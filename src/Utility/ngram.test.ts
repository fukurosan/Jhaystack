import { nGram, edgeGram } from "./ngram"

describe("N-Gram Module", () => {
	const string1 = "Hello World"
	const string2 = "Heeeeeeeello Wooooooorld"
	const string3 = "He"

	it("Edge grams work", () => {
		const expectedResult = JSON.stringify(["H", "He", "Hel", "Hell", "Hello", "Hello ", "Hello W", "Hello Wo", "Hello Wor", "Hello Worl"])
		const expectedResultCustomN = JSON.stringify(["H", "He", "Hel"])
		const emptyStringResult = JSON.stringify([])
		expect(JSON.stringify([...edgeGram(string1)])).toBe(expectedResult)
		expect(JSON.stringify([...edgeGram(string1, 3)])).toBe(expectedResultCustomN)
		expect(JSON.stringify([...edgeGram("")])).toBe(emptyStringResult)
	})

	it("default ngram works", () => {
		const expectedResult = JSON.stringify(["Hel", "ell", "llo", "lo ", "o W", " Wo", "Wor", "orl", "rld"])
		const expectedResult2 = JSON.stringify(["Hee", "eee", "eel", "ell", "llo", "lo ", "o W", " Wo", "Woo", "ooo", "oor", "orl", "rld"])
		const expectedResult3 = JSON.stringify([])
		expect(JSON.stringify([...nGram(string1)])).toBe(expectedResult)
		expect(JSON.stringify([...nGram(string2)])).toBe(expectedResult2)
		expect(JSON.stringify([...nGram(string3)])).toBe(expectedResult3)
	})

	it("custom max/min-Gram ngram works", () => {
		const expectedResult = JSON.stringify([
			"He",
			"Hel",
			"el",
			"ell",
			"ll",
			"llo",
			"lo",
			"lo ",
			"o ",
			"o W",
			" W",
			" Wo",
			"Wo",
			"Wor",
			"or",
			"orl",
			"rl",
			"rld",
			"ld"
		])
		const expectedResult2 = JSON.stringify([])
		expect(JSON.stringify([...nGram(string1, 3, 2)])).toBe(expectedResult)
		expect(JSON.stringify([...nGram("", 3, 1)])).toBe(expectedResult2)
	})
})
