import { VALUE, ATTRIBUTE, DEPTH, RELEVANCE } from "./SortingStrategy"
import SearchResult from "../Model/SearchResult"

describe("Sorting Strategy", () => {

    let items: SearchResult[]

    beforeEach(() => {
        items = [
            new SearchResult({}, ["1", "2", "3", "4", "5", "Attr 2"], "Value 1", 1),
            new SearchResult({}, ["1", "2", "3", "4", "Attr 1"], "Value 2", 0.8),
            new SearchResult({}, ["1", "2", "3", "Attr 6"], "Value 3", 0.7),
            new SearchResult({}, ["1", "2", "Attr 5"], "Value 4", 0.6),
            new SearchResult({}, ["1", "Attr 4"], "Value 5", 0.5),
            new SearchResult({}, ["Attr 3"], "Value 6", 0.4)
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

    it("Sorts by attribute", () => {
        let result = items.sort(ATTRIBUTE.DESCENDING)
        expect(result[0].path[result[0].path.length - 1]).toBe("Attr 6")
        expect(result[5].path[result[5].path.length - 1]).toBe("Attr 1")
        result = items.sort(ATTRIBUTE.ASCENDING)
        expect(result[0].path[result[0].path.length - 1]).toBe("Attr 1")
        expect(result[5].path[result[5].path.length - 1]).toBe("Attr 6")
    })

    it("Sorts by depth", () => {
        let result = items.sort(DEPTH.ASCENDING)
        expect(result[0].depth).toBe(1)
        expect(result[5].depth).toBe(6)
        result = items.sort(DEPTH.DESCENDING)
        expect(result[0].depth).toBe(6)
        expect(result[5].depth).toBe(1)
    })

    it("Sorts by relevance", () => {
        let result = items.sort(RELEVANCE.DESCENDING)
        expect(result[0].relevance).toBe(1)
        expect(result[5].relevance).toBe(0.4)
        result = items.sort(RELEVANCE.ASCENDING)
        expect(result[0].relevance).toBe(0.4)
        expect(result[5].relevance).toBe(1)
    })

})