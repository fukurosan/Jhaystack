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
    BITAP_FUZZY
} from "./ComparisonStrategy"

describe("Comparison Strategy Module", () => {
    it("Fuzzy sequence comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const wayApartTerm = "ddk"
        const invalidTerm = "kcud dlanod"
        expect(FUZZY_SEQUENCE(containsNonCapitalTerm, context)).toBe(true)
        expect(FUZZY_SEQUENCE(invalidTerm, context)).toBe(false)
        expect(FUZZY_SEQUENCE(wayApartTerm, context)).toBe(true)
    })

    it("Starts with comparison works", () => {
        const context = "Donald Duck"
        const startsWithNonCapitalTerm = "donald"
        const invalidTerm = "duck"
        expect(STARTS_WITH(startsWithNonCapitalTerm, context)).toBe(false)
        expect(STARTS_WITH(startsWithNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(true)
        expect(STARTS_WITH(invalidTerm, context)).toBe(false)
    })

    it("Starts with case insensitive comparison works", () => {
        const context = "Donald Duck"
        const startsWithNonCapitalTerm = "donald"
        const invalidTerm = "duck"
        expect(STARTS_WITH_CASE_INSENSITIVE(startsWithNonCapitalTerm, context)).toBe(true)
        expect(STARTS_WITH_CASE_INSENSITIVE(invalidTerm, context)).toBe(false)
    })

    it("Ends with comparison works", () => {
        const context = "Donald Duck"
        const endsWithNonCapitalTerm = "duck"
        const invalidTerm = "donald"
        expect(ENDS_WITH(endsWithNonCapitalTerm, context)).toBe(false)
        expect(ENDS_WITH(endsWithNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(true)
        expect(ENDS_WITH(invalidTerm, context)).toBe(false)
    })

    it("Ends with case insensitive comparison works", () => {
        const context = "Donald Duck"
        const endsWithNonCapitalTerm = "duck"
        const invalidTerm = "donald"
        expect(ENDS_WITH_CASE_INSENSITIVE(endsWithNonCapitalTerm, context)).toBe(true)
        expect(ENDS_WITH_CASE_INSENSITIVE(invalidTerm, context)).toBe(false)
    })

    it("Contains comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const invalidTerm = "kcud"
        expect(CONTAINS(containsNonCapitalTerm, context)).toBe(false)
        expect(CONTAINS(containsNonCapitalTerm.toUpperCase(), context.toUpperCase())).toBe(true)
        expect(CONTAINS(invalidTerm, context)).toBe(false)
    })

    it("Contains case insensitive comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const invalidTerm = "kcud"
        expect(CONTAINS_CASE_INSENSITIVE(containsNonCapitalTerm, context)).toBe(true)
        expect(CONTAINS_CASE_INSENSITIVE(invalidTerm, context)).toBe(false)
    })

    it("Equals comparison works", () => {
        const context = "Donald Duck"
        const exactMatchTerm = "Donald Duck"
        const invalidTerm = "donald duck"
        expect(EQUALS(exactMatchTerm, context)).toBe(true)
        expect(EQUALS(invalidTerm, context)).toBe(false)
        expect(EQUALS(invalidTerm.toUpperCase(), context.toUpperCase())).toBe(true)
    })

    it("Equals case insensitive comparison works", () => {
        const context = "Donald Duck"
        const exactMatchTerm = "Donald Duck"
        const invalidTerm = "donald duck"
        expect(EQUALS_CASE_INSENSITIVE(exactMatchTerm, context)).toBe(true)
        expect(EQUALS_CASE_INSENSITIVE(invalidTerm, context)).toBe(true)
    })

    it("Contains all words comparison works", () => {
        const context = "Donald Quack Duck"
        const validTerm = "duck quack"
        const invalidTerm = "uck quack"
        expect(CONTAINS_ALL_WORDS(validTerm, context)).toBe(true)
        expect(CONTAINS_ALL_WORDS(invalidTerm, context)).toBe(false)
    })

    describe("Bitap comparison works", () => {
        const context = "I have phoned the guy on a telephone"
        const error0Term = "telephone"
        const error0CapitalTerm = "TELEPHONE"
        const error2Term = "elephant"
        const error3Term = "elephantt"

        const secondContext = "Altavista"
        const unrelatedTerm = "Bing"

        it("Does not match unrelated term", () => {
            expect(BITAP_FUZZY(unrelatedTerm, secondContext, 0)).toBe(false)
            expect(BITAP_FUZZY(unrelatedTerm, secondContext, 1)).toBe(false)
        })

        it("Handles exact match", () => {
            expect(BITAP_FUZZY(error0Term, context, 0)).toBe(true)
            expect(BITAP_FUZZY(error0Term, context, 1)).toBe(true)
        })

        it("Handles capital letters", () => {
            expect(BITAP_FUZZY(error0CapitalTerm, context, 0)).toBe(true)
            expect(BITAP_FUZZY(error0CapitalTerm, context, 1)).toBe(true)
        })

        it("Handles fuzzy match with k distance configured", () => {
            expect(BITAP_FUZZY(error2Term, context, 0)).toBe(false)
            expect(BITAP_FUZZY(error2Term, context, 1)).toBe(false)
            expect(BITAP_FUZZY(error2Term, context, 2)).toBe(true)
        })

        it("Default distance is 2", () => {
            expect(BITAP_FUZZY(error2Term, context)).toBe(true)
            expect(BITAP_FUZZY(error3Term, context)).toBe(false)
        })
    })
})