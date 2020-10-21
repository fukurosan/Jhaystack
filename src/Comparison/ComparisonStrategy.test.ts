import {
    FUZZY_SEQUENCE,
    STARTS_WITH,
    STARTS_WITH_CASE_INSENSITIVE,
    ENDS_WITH,
    ENDS_WITH_CASE_INSENSITIVE,
    CONTAINS,
    CONTAINS_CASE_INSENSITIVE,
    EQUALS,
    EQUALS_CASE_INSENSITIVE,
    CONTAINS_ALL_WORDS,
    BITAP,
    BITAP_FULL
} from "./ComparisonStrategy"

describe("Comparison Strategy Module", () => {
    it("Fuzzy sequence comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const wayApartTerm = "ddk"
        const invalidTerm = "kcud dlanod"
        expect(FUZZY_SEQUENCE(containsNonCapitalTerm, context)).toBe(1)
        expect(FUZZY_SEQUENCE(invalidTerm, context)).toBe(0)
        expect(FUZZY_SEQUENCE(wayApartTerm, context)).toBe(0.125)
    })

    it("Starts with comparison works", () => {
        const context = "Donald Duck"
        const startsWithNonCapitalTerm = "donald"
        const invalidTerm = "duck"
        expect(STARTS_WITH(startsWithNonCapitalTerm, context)).toBe(0)
        expect(STARTS_WITH(startsWithNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(1)
        expect(STARTS_WITH(invalidTerm, context)).toBe(0)
    })

    it("Starts with case insensitive comparison works", () => {
        const context = "Donald Duck"
        const startsWithNonCapitalTerm = "donald"
        const invalidTerm = "duck"
        expect(STARTS_WITH_CASE_INSENSITIVE(startsWithNonCapitalTerm, context)).toBe(1)
        expect(STARTS_WITH_CASE_INSENSITIVE(invalidTerm, context)).toBe(0)
    })

    it("Ends with comparison works", () => {
        const context = "Donald Duck"
        const endsWithNonCapitalTerm = "duck"
        const invalidTerm = "donald"
        expect(ENDS_WITH(endsWithNonCapitalTerm, context)).toBe(0)
        expect(ENDS_WITH(endsWithNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(1)
        expect(ENDS_WITH(invalidTerm, context)).toBe(0)
    })

    it("Ends with case insensitive comparison works", () => {
        const context = "Donald Duck"
        const endsWithNonCapitalTerm = "duck"
        const invalidTerm = "donald"
        expect(ENDS_WITH_CASE_INSENSITIVE(endsWithNonCapitalTerm, context)).toBe(1)
        expect(ENDS_WITH_CASE_INSENSITIVE(invalidTerm, context)).toBe(0)
    })

    it("Contains comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const invalidTerm = "kcud"
        expect(CONTAINS(containsNonCapitalTerm, context)).toBe(0)
        expect(CONTAINS(containsNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(1)
        expect(CONTAINS(invalidTerm, context)).toBe(0)
    })

    it("Contains case insensitive comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const invalidTerm = "kcud"
        expect(CONTAINS_CASE_INSENSITIVE(containsNonCapitalTerm, context)).toBe(1)
        expect(CONTAINS_CASE_INSENSITIVE(invalidTerm, context)).toBe(0)
    })

    it("Equals comparison works", () => {
        const context = "Donald Duck"
        const exactMatchTerm = "Donald Duck"
        const invalidTerm = "donald duck"
        expect(EQUALS(exactMatchTerm, context)).toBe(1)
        expect(EQUALS(invalidTerm, context)).toBe(0)
        expect(EQUALS(invalidTerm.toUpperCase(), context.toUpperCase())).toBe(1)
    })

    it("Equals case insensitive comparison works", () => {
        const context = "Donald Duck"
        const exactMatchTerm = "Donald Duck"
        const invalidTerm = "donald duck"
        expect(EQUALS_CASE_INSENSITIVE(exactMatchTerm, context)).toBe(1)
        expect(EQUALS_CASE_INSENSITIVE(invalidTerm, context)).toBe(1)
    })

    it("Contains all words comparison works", () => {
        const context = "Donald Quack Duck"
        const validTerm = "duck quack"
        const invalidTerm = "uck quack"
        expect(CONTAINS_ALL_WORDS(validTerm, context)).toBe(1)
        expect(CONTAINS_ALL_WORDS(invalidTerm, context)).toBe(0)
    })

    describe("Bitap comparison works", () => {
        const context = "I have phoned the guy on a telephone"
        const endingContext = "I have phoned the guy on a ephant"
        const error0Term = "telephone"
        const error0CapitalTerm = "TELEPHONE"
        const error1Term = "elephan"
        const error2Term = "elephant"
        const error3Term = "elephantt"

        const secondContext = "Altavista"
        const unrelatedTerm = "Bing"

        it("Does not match unrelated term", () => {
            expect(BITAP(unrelatedTerm, secondContext, 0)).toBe(0)
            expect(BITAP(unrelatedTerm, secondContext, 1)).toBe(0)
        })

        it("Handles exact match", () => {
            expect(BITAP(error0Term, error0Term, 0)).toBe(0.99999999)
            expect(BITAP(error0Term, context, 1)).toBeGreaterThan(1 / 2)
            expect(BITAP(error0Term, context, 1)).toBeLessThan(1 / 1)
        })

        it("Handles capital letters", () => {
            expect(BITAP(error0CapitalTerm, error0Term, 0)).toBe(0.99999999)
            expect(BITAP(error0CapitalTerm, context, 1)).toBeGreaterThan(1 / 2)
            expect(BITAP(error0CapitalTerm, context, 1)).toBeLessThan(1 / 1)
        })

        it("Handles fuzzy match with k distance configured", () => {
            expect(BITAP(error2Term, context, 0)).toBe(0)
            expect(BITAP(error2Term, context, 1)).toBe(0)
            expect(BITAP(error1Term, context, 1)).toBeGreaterThan(1 / 3)
            expect(BITAP(error1Term, context, 1)).toBeLessThan(1 / 2)
            expect(BITAP(error2Term, context, 2)).toBeGreaterThan(1 / 4)
            expect(BITAP(error2Term, context, 2)).toBeLessThan(1 / 3)
        })

        it("Default distance is 2", () => {
            expect(BITAP(error2Term, context)).toBeGreaterThan(1 / 4)
            expect(BITAP(error2Term, context)).toBeLessThan(1 / 3)
            expect(BITAP(error3Term, context)).toBe(0)
        })

        it("Handles the hit being the final part of the context", () => {
            expect(BITAP(error2Term, endingContext, 2)).toBeGreaterThan(1 / 4)
            expect(BITAP(error2Term, endingContext, 2)).toBeLessThan(1 / 3)
        })

    })

    describe("BitapFull comparison works", () => {
        const context = "I have phoned the guy on a telephone"
        const endingContext = "I have phoned the guy on a ephant"
        const error0Term = "telephone"
        const error0CapitalTerm = "TELEPHONE"
        const error1Term = "elephan"
        const error2Term = "elephant"
        const error3Term = "elephantt"

        const secondContext = "Altavista"
        const unrelatedTerm = "Bing"

        it("Does not match unrelated term", () => {
            expect(BITAP_FULL(unrelatedTerm, secondContext, 0)).toBe(0)
            expect(BITAP_FULL(unrelatedTerm, secondContext, 1)).toBe(0)
        })

        it("Handles exact match", () => {
            expect(BITAP_FULL(error0Term, error0Term, 0)).toBe(0.99999999)
            expect(BITAP_FULL(error0Term, context, 1)).toBeGreaterThan(1 / 2)
            expect(BITAP_FULL(error0Term, context, 1)).toBeLessThan(1 / 1)
        })

        it("Handles capital letters", () => {
            expect(BITAP_FULL(error0CapitalTerm, error0Term, 0)).toBe(0.99999999)
            expect(BITAP_FULL(error0CapitalTerm, context, 1)).toBeGreaterThan(1 / 2)
            expect(BITAP_FULL(error0CapitalTerm, context, 1)).toBeLessThan(1 / 1)
        })

        it("Handles fuzzy match with k distance configured", () => {
            expect(BITAP_FULL(error2Term, context, 0)).toBe(0)
            expect(BITAP_FULL(error2Term, context, 1)).toBe(0)
            expect(BITAP_FULL(error1Term, context, 1)).toBeGreaterThan(1 / 3)
            expect(BITAP_FULL(error1Term, context, 1)).toBeLessThan(1 / 2)
            expect(BITAP_FULL(error2Term, context, 2)).toBeGreaterThan(1 / 4)
            expect(BITAP_FULL(error2Term, context, 2)).toBeLessThan(1 / 3)
        })

        it("Default distance is 2", () => {
            expect(BITAP_FULL(error2Term, context)).toBeGreaterThan(1 / 4)
            expect(BITAP_FULL(error2Term, context)).toBeLessThan(1 / 3)
            expect(BITAP_FULL(error3Term, context)).toBe(0)
        })

        it("Handles the hit being the final part of the context", () => {
            expect(BITAP_FULL(error2Term, endingContext, 2)).toBeGreaterThan(1 / 4)
            expect(BITAP_FULL(error2Term, endingContext, 2)).toBeLessThan(1 / 3)
        })

        it("Finds a more relevant result later in the context", () => {
            const laterInStringContext = "It's called telephone, not telephane"
            const laterInStringSearchTerm = "elephant"
            expect(BITAP_FULL(laterInStringSearchTerm, laterInStringContext, 2)).toBeGreaterThan(1 / 3)
            expect(BITAP_FULL(laterInStringSearchTerm, laterInStringContext, 2)).toBeLessThan(1 / 2)
        })

    })
})