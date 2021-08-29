import { NGRAM, SOUNDEX, NORVIG } from "./spellingStrategy"
import IWordMeta from "../Model/IWordMeta"

describe("Spelling Module", () => {
	const arrayToMap = (wordArray: string[]): Map<string, IWordMeta> => {
		return new Map(wordArray.map(word => [word, { count: 1 }]))
	}
	const sentence1 = arrayToMap(["Peter", "reads", "the", "newspaper", "while", "sipping", "on", "coffee"])
	const transpositionWords = arrayToMap(["while", "white"])
	const sentence1String1 = "peter"
	const sentence1String2 = "news"
	const sentence1String3 = "whiel"
	const newsPaper = "nuwspeper"
	const peter = "petter"
	const sipping = "sibbing"
	const coffee = "cufe"

	it("Ngram Speller works", () => {
		const speller = new NGRAM("1")
		speller.build(sentence1)
		expect(speller.evaluate(sentence1String1)).toBe("peter")
		expect(speller.evaluate(sentence1String2)).toBe(null)
		expect(speller.evaluate(sentence1String3)).toBe("while")

		const speller2 = new NGRAM("1")
		speller2.build(transpositionWords)
		expect(speller2.evaluate("whiet")).toBe("white")
		expect(speller2.evaluate("whiel")).toBe("while")
	})

	it("Soundex Speller works", () => {
		const speller = new SOUNDEX("1")
		speller.build(sentence1)
		expect(speller.evaluate(newsPaper)).toBe("newspaper")
		expect(speller.evaluate(peter)).toBe("peter")
		expect(speller.evaluate(sipping)).toBe("sipping")
		expect(speller.evaluate(coffee)).toBe("coffee")
		expect(speller.evaluate("Nowaythisisathing")).toBe(null)

		const russelSpeller = new SOUNDEX("2", { fuzzy: false })
		russelSpeller.build(sentence1)
		expect(russelSpeller.encode("Kristen")).toBe("k623")
		expect(speller.encode("Kristen")).toBe("k693")
	})

	it("Norvig Speller works", () => {
		const speller = new NORVIG("1")
		speller.build(sentence1)
		expect(speller.evaluate(sentence1String1)).toBe("peter")
		expect(speller.evaluate(sentence1String2)).toBe(null)
		expect(speller.evaluate(sentence1String3)).toBe("while")
		expect(speller.evaluate(newsPaper)).toBe("newspaper")
		expect(speller.evaluate(peter)).toBe("peter")
		expect(speller.evaluate(sipping)).toBe("sipping")
		expect(speller.evaluate(coffee)).toBe(null)
		expect(speller.evaluate("Nowaythisisathing")).toBe(null)
		const speller2 = new NORVIG("1")
		speller2.build(transpositionWords)
		expect(speller2.evaluate("whiet")).toBe("white")
		expect(speller2.evaluate("whiel")).toBe("while")
	})
})
