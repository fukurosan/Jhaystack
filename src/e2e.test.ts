import { Jhaystack, ComparisonStrategy, TraversalStrategy, SortingStrategy, IndexStrategy } from "./index"

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
            .setComparisonStrategy([ComparisonStrategy.FUZZY_SEQUENCE])
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
        //@ts-ignore
            .setComparisonStrategy(ComparisonStrategy.FUZZY_SEQUENCE) //This is incorrectly typed on purpose
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

    it("Typical setup with sorting works", () => {
        const se = new Jhaystack()
            .setComparisonStrategy([ComparisonStrategy.CONTAINS])
            .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
            .setDataset(data)
            .setSortingStrategy([SortingStrategy.ATTRIBUTE])
        let result = se.search("min")
        expect(result.length).toBe(2)
        expect(result[0].item.firstName).toBe("Benjamin")
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

    it("Typical setup with an indexed trigram search works", () => {
        const se = new Jhaystack()
            .setIndexStrategy([IndexStrategy.TRIGRAM])
            .setDataset(data)
        let result = se.indexLookup("Teddy Ject")
        expect(result.length).toBe(1)
        expect(result[0]?.relevance).toBe(0.375)
        expect(result[0]?.item.id).toBe("1")
        expect(JSON.stringify(result[0]?.path)).toBe(JSON.stringify(["children", "0", "nested", "text"]))
        expect(result[0]?.depth).toBe(4)
    })


})