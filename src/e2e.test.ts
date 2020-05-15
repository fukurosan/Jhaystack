import { Jhaystack, ComparisonStrategy, TraversalStrategy } from "./index"

describe("End to end", () => {
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

    it("Typical fuzzy match setup works", () => {
        const se = new Jhaystack()
            .setComparisonStrategy([ComparisonStrategy.FUZZY])
            .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH_ORDERED)
            .setDataset(data)
        const result = se.search("dck")
        expect(result.length).toBe(1)
        expect(result[0].item.firstName).toBe("Arnold")
        expect(result[0].path[0]).toBe("lastName")
        expect(result[0].depth).toBe(1)
    })

    it("Library correctly parses incorrectly specified comparison strategy", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategy.FUZZY)
            .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
        const result = se.search("dck")
        expect(result.length).toBe(1)
        expect(result[0].item.firstName).toBe("Arnold")
        expect(result[0].path[0]).toBe("lastName")
        expect(result[0].depth).toBe(1)
    })

    it("Typical setup with a limiter works", () => {
        const se = new Jhaystack()
            .setComparisonStrategy([ComparisonStrategy.CONTAINS])
            .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
            .setLimit(1)
        let result = se.search("min")
        expect(result.length).toBe(1)
        expect(result[0].item.firstName).toBe("Benjamin")
        expect(result[0].path[0]).toBe("firstName")
        expect(result[0].depth).toBe(1)
    })

    it("Typical setup with a nested search result works", () => {
        const se = new Jhaystack()
            .setComparisonStrategy([ComparisonStrategy.CONTAINS])
            .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
        let result = se.search("Nested")
        expect(result.length).toBe(1)
        expect(result[0].item.id).toBe("1")
        expect(JSON.stringify(result[0].path)).toBe(JSON.stringify(["children", "0", "nested", "text"]))
        expect(result[0].depth).toBe(4)
    })

})