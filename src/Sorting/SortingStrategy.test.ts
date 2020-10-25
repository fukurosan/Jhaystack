import { VALUE, PROPERTY, DEPTH, RELEVANCE, COMPARISON_SCORE, COMPARISON_INDEX } from "./SortingStrategy"
import SearchResult from "../Model/SearchResult"

describe("Sorting Strategy", () => {

    let items: SearchResult[]

    beforeEach(() => {
        items = [
            new SearchResult({}, ["1", "2", "3", "4", "5", "Attr 2"], "Value 1", 1, 1, 0),
            new SearchResult({}, ["1", "2", "3", "4", "Attr 1"], "Value 2", 0.8, 0.8, 0),
            new SearchResult({}, ["1", "2", "3", "Attr 6"], "Value 3", 0.7, 0.7, 0),
            new SearchResult({}, ["1", "2", "Attr 5"], "Value 4", 0.6, 0.6, 0),
            new SearchResult({}, ["1", "Attr 4"], "Value 5", 0.5, 0.5, 1),
            new SearchResult({}, ["Attr 3"], "Value 6", 0.4, 0.4, 1)
        ]
    })

    it("Sorts by value", () => {
        let result = items.sort(VALUE.ASCENDING)
        expect(result[0].value).toBe("Value 1")
        expect(result[5].value).toBe("Value 6")
        result = items.sort(VALUE.DESCENDING)
        expect(result[0].value).toBe("Value 6")
        expect(result[5].value).toBe("Value 1")
    })

    it("Sorts by property", () => {
        let result = items.sort(PROPERTY.DESCENDING)
        expect(result[0].path[result[0].path.length - 1]).toBe("Attr 6")
        expect(result[5].path[result[5].path.length - 1]).toBe("Attr 1")
        result = items.sort(PROPERTY.ASCENDING)
        expect(result[0].path[result[0].path.length - 1]).toBe("Attr 1")
        expect(result[5].path[result[5].path.length - 1]).toBe("Attr 6")
    })

    it("Sorts by depth", () => {
        let result = items.sort(DEPTH.ASCENDING)
        expect(result[0].path.length).toBe(1)
        expect(result[5].path.length).toBe(6)
        result = items.sort(DEPTH.DESCENDING)
        expect(result[0].path.length).toBe(6)
        expect(result[5].path.length).toBe(1)
    })

    it("Sorts by relevance", () => {
        let result = items.sort(RELEVANCE.DESCENDING)
        expect(result[0].relevance).toBe(1)
        expect(result[5].relevance).toBe(0.4)
        result = items.sort(RELEVANCE.ASCENDING)
        expect(result[0].relevance).toBe(0.4)
        expect(result[5].relevance).toBe(1)
    })
    
    it("Sorts by comparison score", () => {
        let result = items.sort(COMPARISON_SCORE.DESCENDING)
        expect(result[0].comparisonScore).toBe(1)
        expect(result[5].comparisonScore).toBe(0.4)
        result = items.sort(COMPARISON_SCORE.ASCENDING)
        expect(result[0].comparisonScore).toBe(0.4)
        expect(result[5].comparisonScore).toBe(1)
    })
    
    it("Sorts by comparison index", () => {
        let result = items.sort(COMPARISON_INDEX.DESCENDING)
        expect(result[0].comparisonIndex).toBe(1)
        expect(result[5].comparisonIndex).toBe(0)
        result = items.sort(COMPARISON_INDEX.ASCENDING)
        expect(result[0].comparisonIndex).toBe(0)
        expect(result[5].comparisonIndex).toBe(1)
    })

})