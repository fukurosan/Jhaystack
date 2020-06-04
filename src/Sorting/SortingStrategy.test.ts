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
        const result = items.sort(VALUE)
        expect(result[0].value).toBe("Value 1")
        expect(result[5].value).toBe("Value 6")
    })

    it("Sorts by attribute", () => {
        const result = items.sort(ATTRIBUTE)
        expect(result[0].value).toBe("Value 2")
        expect(result[5].value).toBe("Value 3")
    })

    it("Sorts by depth", () => {
        const result = items.sort(DEPTH)
        expect(result[0].value).toBe("Value 6")
        expect(result[5].value).toBe("Value 1")
    })

    it("Sorts by relevance", () => {
        const result = items.sort(RELEVANCE)
        expect(result[0].relevance).toBe(1)
        expect(result[5].relevance).toBe(0.4)
    })

})