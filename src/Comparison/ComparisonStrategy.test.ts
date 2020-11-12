import IComparisonResult from "../Model/IComparisonResult"
import { FUZZY_SEQUENCE, STARTS_WITH, ENDS_WITH, CONTAINS, EQUALS, CONTAINS_ALL_WORDS, BITAP, REGULAR_EXPRESSION } from "./ComparisonStrategy"

describe("Comparison Strategy Module", () => {
	it("Fuzzy sequence comparison works", () => {
		const context = "Donald Duck"
		const containsNonCapitalTerm = "ald du"
		const wayApartTerm = "ddk"
		const invalidTerm = "kcud dlanod"
		expect((<IComparisonResult>FUZZY_SEQUENCE(containsNonCapitalTerm, context, false)).score).toBe(1)
		expect(FUZZY_SEQUENCE(invalidTerm, context, false)).toBe(0)
		expect((<IComparisonResult>FUZZY_SEQUENCE(wayApartTerm, context, false)).score).toBe(0.125)
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
