import { Jhaystack, ComparisonStrategies, TraversalStrategies } from "./index"

const data = [
    {
        firstName: "Arnold",
        lastName: "Duck"
    },
    {
        firstName: "Benjamin",
        lastName: "Chicken"
    },
    {
        firstName: "Elisa",
        lastName: "Flamingo"
    },
    {
        id: "1",
        children: [
            {
                id: "2",
                nested: {
                    id: "3",
                    text: "Nested object"
                }
            }
        ]
    }
]
describe("End to end", () => {
    it("Exact match works!", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.EXACT_MATCH)
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
            .setDataset(data)
        const result = se.search("Chicken")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Benjamin")
    })

    it("Fuzzy match works!", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.FUZZY_SEARCH)
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
            .setDataset(data)
        const result = se.search("dck")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Arnold")
    })

    it("Starts with match works!", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.STARTS_WITH)
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
            .setDataset(data)
        let result = se.search("Flam")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Elisa")
    })

    it("Contains match works!", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.CONTAINS)
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
            .setDataset(data)
        let result = se.search("min")
        expect(result.length).toBe(2)
        expect(result[0].firstName).toBe("Benjamin")
        expect(result[1].firstName).toBe("Elisa")
    })

    it("Nested Extraction works!", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.EXACT_MATCH)
            .setTraversalStrategy(TraversalStrategies.EXTRACT_ALL_NESTED)
            .setDataset(data)
        const result = se.search("3")
        expect(result.length === 1)
        expect(result[0].text).toBe("Nested object")
    })
})