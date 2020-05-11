import {
    FUZZY,
    STARTS_WITH,
    STARTS_WITH_CASE_INSENSITIVE,
    ENDS_WITH,
    ENDS_WITH_CASE_INSENSITIVE,
    CONTAINS,
    CONTAINS_CASE_INSENSITIVE,
    EQUALS,
    EQUALS_CASE_INSENSITIVE
} from "./ComparisonStrategy"

describe("Comparison Strategy Module", () => {
    it("Fuzzy comparison works", () => {
        const context = "Donald Duck"
        const containsNonCapitalTerm = "ald du"
        const wayApartTerm = "ddk"
        const invalidTerm = "kcud dlanod"
        expect(FUZZY(containsNonCapitalTerm, context)).toBe(true)
        expect(FUZZY(invalidTerm, context)).toBe(false)
        expect(FUZZY(wayApartTerm, context)).toBe(true)
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
})