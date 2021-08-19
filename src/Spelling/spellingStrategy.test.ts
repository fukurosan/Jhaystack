import { TRIGRAM_SPELLER } from "./spellingStrategy"

describe("Spelling Module", () => {
	const sentence1 = ["Peter", "reads", "the", "newspaper", "while", "sipping", "on", "coffee"]
	const sentence1String1 = "peter"
	const sentence1String2 = "news"
	const sentence1String3 = "whiel"

	it("Trigram Speller works", () => {
		const speller = new TRIGRAM_SPELLER()
		speller.build(sentence1)
		expect(speller.evaluate(sentence1String1)).toBe("Peter")
		expect(speller.evaluate(sentence1String2)).toBe(null)
		expect(speller.evaluate(sentence1String3)).toBe("while")

		const damerauWords = ["while", "white"]
		const speller2 = new TRIGRAM_SPELLER()
		speller2.build(damerauWords)
		expect(speller2.evaluate("whiet")).toBe("white")
		expect(speller2.evaluate("whiel")).toBe("while")
	})
})
