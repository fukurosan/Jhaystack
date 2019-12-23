import { FUZZY_SEARCH, STARTS_WITH, CONTAINS, EXACT_MATCH } from "./ComparisonStrategy"

test("Fuzzy comparison works!", () => {
    const context = "Donald Duck"
    const containsNonCapitalTerm = "ald du"
    const wayApartTerm = "ddk"
    const invalidTerm = "kcud dlanod"
    expect(FUZZY_SEARCH(containsNonCapitalTerm, context)).toBe(true)
    expect(FUZZY_SEARCH(invalidTerm, context)).toBe(false)
    expect(FUZZY_SEARCH(wayApartTerm, context)).toBe(true)
})

test("Starts with comparison works!", () => {
    const context = "Donald Duck"
    const startsWithNonCapitalTerm = "donald"
    const invalidTerm = "duck"
    expect(STARTS_WITH(startsWithNonCapitalTerm, context)).toBe(true)
    expect(STARTS_WITH(invalidTerm, context)).toBe(false)
})

test("Contains comparison works!", () => {
    const context = "Donald Duck"
    const containsNonCapitalTerm = "ald du"
    const invalidTerm = "kcud"
    expect(CONTAINS(containsNonCapitalTerm, context)).toBe(true)
    expect(CONTAINS(invalidTerm, context)).toBe(false)
})

test("Exact comparison works!", () => {
    const context = "Donald Duck"
    const exactMatchTerm = "Donald Duck"
    const invalidTerm = "donald duck"
    expect(EXACT_MATCH(exactMatchTerm, context)).toBe(true)
    expect(EXACT_MATCH(invalidTerm, context)).toBe(false)
})