import IComparisonResult from "../Model/IComparisonResult"
import {
	FUZZY_SEQUENCE,
	STARTS_WITH,
	ENDS_WITH,
	CONTAINS,
	EQUALS,
	CONTAINS_ALL_WORDS,
	BITAP,
	REGULAR_EXPRESSION,
	QGRAM,
	LONGEST_COMMON_SUBSTRING,
	LEVENSHTEIN,
	JARO_WINKLER,
	JACCARD,
	HAMMING,
	EUCLIDEAN,
	DAMERAU,
	COSINE
} from "./ComparisonStrategy"

describe("Comparison Strategy Module", () => {
	it("Fuzzy sequence comparison works", () => {
		const context = "Donald Duck"
		const containsNonCapitalTerm = "ald Du"
		const wayApartTerm = "DDk"
		const invalidTerm = "kcuD Dlanod"
		expect((<IComparisonResult>FUZZY_SEQUENCE(containsNonCapitalTerm, context)).score).toBe(1)
		expect(FUZZY_SEQUENCE(invalidTerm, context)).toBe(0)
		expect((<IComparisonResult>FUZZY_SEQUENCE(wayApartTerm, context, 0.1)).score).toBe(0.125)
	})

	it("Starts with comparison works", () => {
		const context = "Donald Duck"
		const startsWithNonCapitalTerm = "donald"
		const invalidTerm = "duck"
		expect(STARTS_WITH(startsWithNonCapitalTerm, context, true)).toBe(0)
		expect(STARTS_WITH(startsWithNonCapitalTerm.toUpperCase(), context.toUpperCase(), true)).toBe(1)
		expect(STARTS_WITH(invalidTerm, context, true)).toBe(0)
		expect(STARTS_WITH(startsWithNonCapitalTerm, context, false)).toBe(1)
		expect(STARTS_WITH(invalidTerm, context, false)).toBe(0)
	})

	it("Ends with comparison works", () => {
		const context = "Donald Duck"
		const endsWithNonCapitalTerm = "duck"
		const invalidTerm = "donald"
		expect(ENDS_WITH(endsWithNonCapitalTerm, context, true)).toBe(0)
		expect(ENDS_WITH(endsWithNonCapitalTerm.toUpperCase(), context.toUpperCase(), true)).toBe(1)
		expect(ENDS_WITH(invalidTerm, context, true)).toBe(0)
		expect(ENDS_WITH(endsWithNonCapitalTerm, context, false)).toBe(1)
		expect(ENDS_WITH(invalidTerm, context, false)).toBe(0)
	})

	it("Contains comparison works", () => {
		const context = "Donald Duck"
		const containsNonCapitalTerm = "ald du"
		const invalidTerm = "kcud"
		expect(CONTAINS(containsNonCapitalTerm, context, true)).toBe(0)
		expect(CONTAINS(containsNonCapitalTerm.toUpperCase(), context.toUpperCase(), true)).toBe(1)
		expect(CONTAINS(invalidTerm, context, true)).toBe(0)
		expect(CONTAINS(containsNonCapitalTerm, context, false)).toBe(1)
		expect(CONTAINS(invalidTerm, context, false)).toBe(0)
	})

	it("Equals comparison works", () => {
		const context = "Donald Duck"
		const exactMatchTerm = "Donald Duck"
		const invalidTerm = "donald duck"
		expect(EQUALS(exactMatchTerm, context, true)).toBe(1)
		expect(EQUALS(invalidTerm, context, true)).toBe(0)
		expect(EQUALS(invalidTerm.toUpperCase(), context.toUpperCase(), true)).toBe(1)
		expect(EQUALS(exactMatchTerm, context, false)).toBe(1)
		expect(EQUALS(invalidTerm, context, false)).toBe(1)
	})

	it("Contains all words comparison works", () => {
		const context = "Donald Quack Duck"
		const validTerm = "duck quack"
		const invalidTerm = "uck quack"
		expect(CONTAINS_ALL_WORDS(validTerm, context, false)).toBe(1)
		expect(CONTAINS_ALL_WORDS(invalidTerm, context, false)).toBe(0)
	})

	it("Regular expression comparison works", () => {
		const context = "Donald Quack Duck"
		const validTerm = /Quack Duck$/
		const invalidTerm = /Duck Quack/
		expect(REGULAR_EXPRESSION(validTerm, context, true)).toBe(1)
		expect(REGULAR_EXPRESSION(invalidTerm, context, true)).toBe(0)
		const validTermCapital = /QUACK DUCK$/
		const invalidTermCapital = /DUCK QUACK/
		expect(REGULAR_EXPRESSION(validTermCapital, context, false)).toBe(1)
		expect(REGULAR_EXPRESSION(invalidTermCapital, context, false)).toBe(0)
	})

	it("Qgram works", () => {
		const context = "Donald Duck"
		const exactMatchTerm = "Donald Duck"
		const distantTerm = "donald duck"
		expect(QGRAM(exactMatchTerm, context)).toBe(1)
		expect(QGRAM(distantTerm, context)).toBe(0.5555555555555556)
		expect(QGRAM(exactMatchTerm, context, 2)).toBe(1)
		expect(QGRAM(distantTerm, context, 2)).toBe(0.7)
	})

	it("Longest Common Substring works", () => {
		const context = "Hello World"
		const exactMatchTerm = "Hello World"
		const distantTerm = "Say hello to the world!"
		expect(LONGEST_COMMON_SUBSTRING(exactMatchTerm, context)).toBe(1)
		expect(LONGEST_COMMON_SUBSTRING(distantTerm, context)).toBe(0)
		expect(LONGEST_COMMON_SUBSTRING(exactMatchTerm, context, false, 0.8)).toBe(1)
		expect(LONGEST_COMMON_SUBSTRING(distantTerm, context, false, 0.1)).toBe((5 * 2) / 34)
		expect(LONGEST_COMMON_SUBSTRING(exactMatchTerm, context, true)).toBe(1)
		expect(LONGEST_COMMON_SUBSTRING(context, distantTerm, true)).toBe(0.45454545454545453)
	})

	it("Levenshtein works", () => {
		const context = "Hello World"
		const similarTerm = "hello world"
		const distantTerm = "Hel Wold!"
		expect(LEVENSHTEIN(similarTerm, context)).toBe(0.8181818181818181)
		expect(LEVENSHTEIN(distantTerm, context)).toBe(0.4545454545454546)
		expect(LEVENSHTEIN(similarTerm, context, 0.9)).toBe(0)
		expect(LEVENSHTEIN(distantTerm, context, 0.1)).toBe(0.4545454545454546)
	})

	it("Jaro-Winkler works", () => {
		const context = "Hello World"
		const exactMatch = "Hello World"
		const distantTermWithPrefix = "Hel Wold!"
		const similarTerm = "hello world"
		const completelyDifferentTermWithPrefix = "Hello mashed potatoes"
		const backwardsTerm = "dlroW olleH"
		const distantTerm = "The big World"
		const completelyDifferentTerm = "Mashed Potatoes"
		expect(JARO_WINKLER(exactMatch, context)).toBe(1)
		expect(JARO_WINKLER(distantTermWithPrefix, context)).toBe(0.8963101062710438)
		expect(JARO_WINKLER(similarTerm, context)).toBe(0.8430890940656566)
		expect(JARO_WINKLER(completelyDifferentTermWithPrefix, context)).toBe(0.8216206075825216)
		expect(JARO_WINKLER(backwardsTerm, context)).toBe(0.7472985998376623)
		expect(JARO_WINKLER(distantTerm, context)).toBe(0.6787410180964869)
		expect(JARO_WINKLER(completelyDifferentTerm, context)).toBe(0)
		expect(JARO_WINKLER(completelyDifferentTerm, context, 0.58)).toBe(0.5952108980429293)
	})

	it("Jaccard works", () => {
		const context = "Hello World"
		const exactMatch = "Hello World"
		const distantTermWithPrefix = "Hel Wold!"
		const similarTerm = "hello world"
		const completelyDifferentTermWithPrefix = "Hello mashed potatoes"
		const backwardsTerm = "dlroW olleH"
		const distantTerm = "The big World"
		const completelyDifferentTerm = "Mashed Potatoes"
		expect(JACCARD(exactMatch, context)).toBe(1)
		expect(JACCARD(distantTermWithPrefix, context)).toBe(0)
		expect(JACCARD(distantTermWithPrefix, context, 0.1)).toBe(0.16666666666666666)
		expect(JACCARD(distantTermWithPrefix, context, 0.1, 2)).toBe(0.3333333333333333)
		expect(JACCARD(similarTerm, context)).toBe(0.3333333333333333)
		expect(JACCARD(completelyDifferentTermWithPrefix, context)).toBe(0)
		expect(JACCARD(backwardsTerm, context)).toBe(0)
		expect(JACCARD(distantTerm, context)).toBe(0)
		expect(JACCARD(completelyDifferentTerm, context)).toBe(0)
		expect(JACCARD(completelyDifferentTerm, context)).toBe(0)
	})

	it("Hamming works", () => {
		const context = "Hello World"
		const textTerm = "hello world"
		const numberContext = 14
		const numberTerm = 9
		expect(HAMMING(textTerm, context)).toBe(0.8181818181818181)
		expect(HAMMING(numberTerm, numberContext)).toBe(3) //Because 0111 and 1001 (Three bits are different)
	})

	it("Euclidean works", () => {
		const context = "Hello World"
		const exactMatch = "Hello World"
		const distantTermWithPrefix = "Hel Wold!"
		const similarTerm = "hello world"
		const completelyDifferentTermWithPrefix = "Hello mashed potatoes"
		const backwardsTerm = "dlroW olleH"
		const distantTerm = "The big World"
		const completelyDifferentTerm = "Mashed Potatoes"
		expect(EUCLIDEAN(exactMatch, context)).toBe(1)
		expect(EUCLIDEAN(distantTermWithPrefix, context)).toBe(0)
		expect(EUCLIDEAN(distantTermWithPrefix, context, 0.1)).toBe(0.683772233983162)
		expect(EUCLIDEAN(distantTermWithPrefix, context, 0.1, 2)).toBe(0.6464466094067263)
		expect(EUCLIDEAN(similarTerm, context)).toBe(0)
		expect(EUCLIDEAN(similarTerm, context, 0.1)).toBe(0.6464466094067263)
		expect(EUCLIDEAN(completelyDifferentTermWithPrefix, context)).toBe(0.7642977396044841)
		expect(EUCLIDEAN(backwardsTerm, context)).toBe(0.75)
		expect(EUCLIDEAN(distantTerm, context)).toBe(0.7113248654051871)
		expect(EUCLIDEAN(completelyDifferentTerm, context)).toBe(0.7763932022500211)
	})

	it("Damerau works", () => {
		const context = "Hello World"
		const exactMatch = "Hello World"
		const distantTermWithPrefix = "Hel Wold!"
		const similarTerm = "hello world"
		const completelyDifferentTermWithPrefix = "Hello mashed potatoes"
		const backwardsTerm = "dlroW olleH"
		const distantTerm = "The big World"
		const completelyDifferentTerm = "Mashed Potatoes"
		expect(DAMERAU(exactMatch, context)).toBe(1)
		expect(DAMERAU(distantTermWithPrefix, context)).toBe(0.6363636363636364)
		expect(DAMERAU(distantTermWithPrefix, context, 0.7)).toBe(0)
		expect(DAMERAU(similarTerm, context)).toBe(0.8181818181818181)
		expect(DAMERAU(completelyDifferentTermWithPrefix, context)).toBe(0.33333333333333337)
		expect(DAMERAU(backwardsTerm, context)).toBe(0.36363636363636365)
		expect(DAMERAU(distantTerm, context)).toBe(0.5384615384615384)
		expect(DAMERAU(completelyDifferentTerm, context)).toBe(0)
	})

	it("Cosine works", () => {
		const context = "Hello World"
		const exactMatch = "Hello World"
		const distantTermWithPrefix = "Hel Wold!"
		const similarTerm = "hello world"
		const completelyDifferentTermWithPrefix = "Hello mashed potatoes"
		const backwardsTerm = "dlroW olleH"
		const distantTerm = "The big World"
		const completelyDifferentTerm = "Mashed Potatoes"
		expect(COSINE(exactMatch, context)).toBe(1)
		expect(COSINE(distantTermWithPrefix, context)).toBe(0.2886751345948129)
		expect(COSINE(distantTermWithPrefix, context, 0.3)).toBe(0)
		expect(COSINE(distantTermWithPrefix, context, 0.3, 2)).toBe(0.5039526306789696)
		expect(COSINE(similarTerm, context)).toBe(0.5)
		expect(COSINE(completelyDifferentTermWithPrefix, context)).toBe(0.3333333333333333)
		expect(COSINE(backwardsTerm, context)).toBe(0)
		expect(COSINE(distantTerm, context)).toBe(0.33541019662496846)
		expect(COSINE(completelyDifferentTerm, context)).toBe(0)
	})

	describe("Bitap comparison works", () => {
		const context = "I have phoned the guy on a telephone"
		const endingContext = "I have phoned the guy on a ephant"
		const error0Term = "telephone"
		const error0CapitalTerm = "TELEPHONE"
		const error1Term = "elephan"
		const error2Term = "elephant"
		const error3Term = "elephantt"
		const betterMatchLaterInContextTerm = "ephone"

		const secondContext = "Altavista"
		const unrelatedTerm = "Bing"

		it("Does not match a more relevant term later in the context", () => {
			expect((<IComparisonResult>BITAP(betterMatchLaterInContextTerm, context, false, false, 2)).score).toBeGreaterThan(1 / 3)
			expect((<IComparisonResult>BITAP(betterMatchLaterInContextTerm, context, false, false, 2)).score).toBeLessThan((1 / 3) * 2)
		})

		it("Does not match unrelated term", () => {
			expect(BITAP(unrelatedTerm, secondContext, false, false, 0)).toBe(0)
			expect(BITAP(unrelatedTerm, secondContext, false, false, 1)).toBe(0)
		})

		it("Handles exact match", () => {
			expect((<IComparisonResult>BITAP(error0Term, error0Term, false, false, 0)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error0Term, context, false, false, 1)).score).toBeGreaterThan(1 / 2)
			expect((<IComparisonResult>BITAP(error0Term, context, false, false, 1)).score).toBeLessThan(1 / 1)
		})

		it("Handles capital letters", () => {
			expect((<IComparisonResult>BITAP(error0CapitalTerm, error0Term, false, false, 0)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error0CapitalTerm, context, false, false, 1)).score).toBeGreaterThan(1 / 2)
			expect((<IComparisonResult>BITAP(error0CapitalTerm, context, false, false, 1)).score).toBeLessThan(1 / 1)
		})

		it("Handles fuzzy match with k distance configured", () => {
			expect(BITAP(error2Term, context, false, false, 0)).toBe(0)
			expect(BITAP(error2Term, context, false, false, 1)).toBe(0)
			expect((<IComparisonResult>BITAP(error1Term, context, false, false, 1)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error1Term, context, false, false, 1)).score).toBeLessThan(1 / 2)
			expect((<IComparisonResult>BITAP(error2Term, context, false, false, 2)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, context, false, false, 2)).score).toBeLessThan(1 / 3)
		})

		it("Default distance is 2", () => {
			expect((<IComparisonResult>BITAP(error2Term, context, false)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, context, false)).score).toBeLessThan(1 / 3)
			expect(BITAP(error3Term, context, false)).toBe(0)
		})

		it("Handles the hit being the final part of the context", () => {
			expect((<IComparisonResult>BITAP(error2Term, endingContext, false, false, 2)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, endingContext, false, false, 2)).score).toBeLessThan(1 / 3)
		})

		it("Can ignore match position", () => {
			expect((<IComparisonResult>BITAP(error0Term, context, false, false, 1, false, false)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error1Term, context, false, false, 1, false, false)).score).toBe(0.49999999)
			expect((<IComparisonResult>BITAP(error2Term, context, false, false, 2, false, false)).score).toBe(0.3333333233333333)
		})
	})

	describe("Bitap full scan comparison works", () => {
		const context = "I have phoned the guy on a telephone"
		const endingContext = "I have phoned the guy on a ephant"
		const error0Term = "telephone"
		const error0CapitalTerm = "TELEPHONE"
		const error1Term = "elephan"
		const error2Term = "elephant"
		const error3Term = "elephantt"
		const betterMatchLaterInContextTerm = "ephone"

		const secondContext = "Altavista"
		const unrelatedTerm = "Bing"

		it("Matches a more relevant term later in the context", () => {
			expect((<IComparisonResult>BITAP(betterMatchLaterInContextTerm, context, false, true, 2)).score).toBeGreaterThan((1 / 3) * 2)
			expect((<IComparisonResult>BITAP(betterMatchLaterInContextTerm, context, false, true, 2)).score).toBeLessThan(1)
		})

		it("Does not match unrelated term", () => {
			expect(BITAP(unrelatedTerm, secondContext, false, true, 0)).toBe(0)
			expect(BITAP(unrelatedTerm, secondContext, false, true, 1)).toBe(0)
		})

		it("Handles exact match", () => {
			expect((<IComparisonResult>BITAP(error0Term, error0Term, false, true, 0)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error0Term, context, false, true, 1)).score).toBeGreaterThan(1 / 2)
			expect((<IComparisonResult>BITAP(error0Term, context, false, true, 1)).score).toBeLessThan(1 / 1)
		})

		it("Handles capital letters", () => {
			expect((<IComparisonResult>BITAP(error0CapitalTerm, error0Term, false, true, 0)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error0CapitalTerm, context, false, true, 1)).score).toBeGreaterThan(1 / 2)
			expect((<IComparisonResult>BITAP(error0CapitalTerm, context, false, true, 1)).score).toBeLessThan(1 / 1)
		})

		it("Handles fuzzy match with k distance configured", () => {
			expect(BITAP(error2Term, context, false, true, 0)).toBe(0)
			expect(BITAP(error2Term, context, false, true, 1)).toBe(0)
			expect((<IComparisonResult>BITAP(error1Term, context, false, true, 1)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error1Term, context, false, true, 1)).score).toBeLessThan(1 / 2)
			expect((<IComparisonResult>BITAP(error2Term, context, false, true, 2)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, context, false, true, 2)).score).toBeLessThan(1 / 3)
		})

		it("Default distance is 2", () => {
			expect((<IComparisonResult>BITAP(error2Term, context, false, true)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, context, false, true)).score).toBeLessThan(1 / 3)
			expect(BITAP(error3Term, context, false, true)).toBe(0)
		})

		it("Handles the hit being the final part of the context", () => {
			expect((<IComparisonResult>BITAP(error2Term, endingContext, false, true, 2)).score).toBeGreaterThan(0)
			expect((<IComparisonResult>BITAP(error2Term, endingContext, false, true, 2)).score).toBeLessThan(1 / 3)
		})

		it("Finds a more relevant result later in the context", () => {
			const laterInStringContext = "It's called telephone, not telephane"
			const laterInStringSearchTerm = "elephant"
			expect((<IComparisonResult>BITAP(laterInStringSearchTerm, laterInStringContext, false, true, 2)).score).toBeGreaterThan(1 / 3)
			expect((<IComparisonResult>BITAP(laterInStringSearchTerm, laterInStringContext, false, true, 2)).score).toBeLessThan((1 / 3) * 2)
		})

		it("Can ignore match position", () => {
			expect((<IComparisonResult>BITAP(error0Term, context, false, true, 1, false, false)).score).toBe(0.99999999)
			expect((<IComparisonResult>BITAP(error1Term, context, false, true, 1, false, false)).score).toBe(0.49999999)
			expect((<IComparisonResult>BITAP(error2Term, context, false, true, 2, false, false)).score).toBe(0.3333333233333333)
		})
	})
})
