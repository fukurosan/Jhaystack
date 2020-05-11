import { Jhaystack, ComparisonStrategies, TraversalStrategies } from "./index"

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
            .setComparisonStrategy([ComparisonStrategies.FUZZY])
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
        const result = se.search("dck")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Arnold")
    })

    it("Library correctly parses incorrectly specified comparison strategy", () => {
        const se = new Jhaystack()
            .setComparisonStrategy(ComparisonStrategies.FUZZY)
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
        const result = se.search("dck")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Arnold")
    })

    it("Typical setup with a limiter works", () => {
        const se = new Jhaystack()
            .setComparisonStrategy([ComparisonStrategies.CONTAINS])
            .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
            .setLimit(1)
        let result = se.search("min")
        expect(result.length).toBe(1)
        expect(result[0].firstName).toBe("Benjamin")
    })

})