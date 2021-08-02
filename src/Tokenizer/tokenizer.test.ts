import { WORD, SHINGLE, NGRAM, EDGE_GRAM } from "./TokenizerStrategy"

describe("Sorting Strategy", () => {
	const value = "I like lots of ice cream."

	it("Handles word tokens", () => {
		const expectedValue = {
			I: [{ offsetEnd: 0, offsetStart: 0, position: 0 }],
			["cream."]: [{ offsetEnd: 24, offsetStart: 19, position: 5 }],
			ice: [{ offsetEnd: 17, offsetStart: 15, position: 4 }],
			like: [{ offsetEnd: 5, offsetStart: 2, position: 1 }],
			lots: [{ offsetEnd: 10, offsetStart: 7, position: 2 }],
			of: [{ offsetEnd: 13, offsetStart: 12, position: 3 }]
		}
		expect(WORD(value)).toStrictEqual(expectedValue)
	})

	it("Handles shingle tokens", () => {
		const expectedValue = {
			I: [{ offsetEnd: 0, offsetStart: 0, position: 0 }],
			"I like": [{ offsetEnd: 5, offsetStart: 0, position: 0 }],
			"cream.": [{ offsetEnd: 24, offsetStart: 19, position: 5 }],
			ice: [{ offsetEnd: 17, offsetStart: 15, position: 4 }],
			"ice cream.": [{ offsetEnd: 24, offsetStart: 15, position: 4 }],
			like: [{ offsetEnd: 5, offsetStart: 2, position: 1 }],
			"like lots": [{ offsetEnd: 10, offsetStart: 2, position: 1 }],
			lots: [{ offsetEnd: 10, offsetStart: 7, position: 2 }],
			"lots of": [{ offsetEnd: 13, offsetStart: 7, position: 2 }],
			of: [{ offsetEnd: 13, offsetStart: 12, position: 3 }],
			"of ice": [{ offsetEnd: 17, offsetStart: 12, position: 3 }]
		}
		expect(SHINGLE(value)).toStrictEqual(expectedValue)
	})

	it("Handles edge gram tokens", () => {
		const expectedValue = {
			I: [{ offsetEnd: 0, offsetStart: 0, position: 0 }],
			"I ": [{ offsetEnd: 1, offsetStart: 0, position: 0 }],
			"I l": [{ offsetEnd: 2, offsetStart: 0, position: 0 }],
			"I li": [{ offsetEnd: 3, offsetStart: 0, position: 0 }],
			"I lik": [{ offsetEnd: 4, offsetStart: 0, position: 0 }],
			"I like": [{ offsetEnd: 5, offsetStart: 0, position: 0 }],
			"I like ": [{ offsetEnd: 6, offsetStart: 0, position: 0 }],
			"I like l": [{ offsetEnd: 7, offsetStart: 0, position: 0 }],
			"I like lo": [{ offsetEnd: 8, offsetStart: 0, position: 0 }],
			"I like lot": [{ offsetEnd: 9, offsetStart: 0, position: 0 }]
		}
		expect(EDGE_GRAM(value)).toStrictEqual(expectedValue)
	})

	it("Handles ngram tokens", () => {
		const expectedValue = {
			" cr": [{ offsetEnd: 2, offsetStart: 18, position: 18 }],
			" ic": [{ offsetEnd: 2, offsetStart: 14, position: 14 }],
			" li": [{ offsetEnd: 2, offsetStart: 1, position: 1 }],
			" lo": [{ offsetEnd: 2, offsetStart: 6, position: 6 }],
			" of": [{ offsetEnd: 2, offsetStart: 11, position: 11 }],
			"I l": [{ offsetEnd: 2, offsetStart: 0, position: 0 }],
			"am.": [{ offsetEnd: 2, offsetStart: 22, position: 22 }],
			"ce ": [{ offsetEnd: 2, offsetStart: 16, position: 16 }],
			cre: [{ offsetEnd: 2, offsetStart: 19, position: 19 }],
			"e c": [{ offsetEnd: 2, offsetStart: 17, position: 17 }],
			"e l": [{ offsetEnd: 2, offsetStart: 5, position: 5 }],
			eam: [{ offsetEnd: 2, offsetStart: 21, position: 21 }],
			"f i": [{ offsetEnd: 2, offsetStart: 13, position: 13 }],
			ice: [{ offsetEnd: 2, offsetStart: 15, position: 15 }],
			ike: [{ offsetEnd: 2, offsetStart: 3, position: 3 }],
			"ke ": [{ offsetEnd: 2, offsetStart: 4, position: 4 }],
			lik: [{ offsetEnd: 2, offsetStart: 2, position: 2 }],
			lot: [{ offsetEnd: 2, offsetStart: 7, position: 7 }],
			"of ": [{ offsetEnd: 2, offsetStart: 12, position: 12 }],
			ots: [{ offsetEnd: 2, offsetStart: 8, position: 8 }],
			rea: [{ offsetEnd: 2, offsetStart: 20, position: 20 }],
			"s o": [{ offsetEnd: 2, offsetStart: 10, position: 10 }],
			"ts ": [{ offsetEnd: 2, offsetStart: 9, position: 9 }]
		}
		expect(NGRAM(value)).toStrictEqual(expectedValue)
	})
})
