import { SORT_BY_VALUE, SORT_BY_ATTRIBUTE, SORT_BY_DEPTH } from "./SortingStrategy"
import SearchResult from "../Model/SearchResult"

describe("Sorting Strategy", () => {

    let items

    beforeEach(() => {
        items = [
            new SearchResult({}, ["1", "2", "3", "4", "5", "Attr 2"], "Value 1"),
            new SearchResult({}, ["1", "2", "3", "4", "Attr 1"], "Value 2"),
            new SearchResult({}, ["1", "2", "3", "Attr 6"], "Value 3"),
            new SearchResult({}, ["1", "2", "Attr 5"], "Value 4"),
            new SearchResult({}, ["1", "Attr 4"], "Value 5"),
            new SearchResult({}, ["Attr 3"], "Value 6")
        ]
    })

    it("Sorts by value", () => {
        const result = items.sort(SORT_BY_VALUE)
        expect(result[0].value).toBe("Value 1")
        expect(result[5].value).toBe("Value 6")
    })

    it("Sorts by attribute", () => {
        const result = items.sort(SORT_BY_ATTRIBUTE)
        expect(result[0].value).toBe("Value 2")
        expect(result[5].value).toBe("Value 3")
    })

    it("Sort by depth", () => {
        const result = items.sort(SORT_BY_DEPTH)
        expect(result[0].value).toBe("Value 6")
        expect(result[5].value).toBe("Value 1")
    })

})