import { EXTRACT_ALL_NESTED, RETURN_ROOT_ON_FIRST_MATCH, RETURN_ROOT_ON_FIRST_MATCH_ORDERED } from "./TraversalStrategy"
import { STARTS_WITH, CONTAINS } from "./ComparisonStrategy"

describe("Traversal Strategy", () => {
    const data = [
        {
            firstName: "Benjamin",
            lastName: "Chicken"
        },
        {
            firstName: "mini",
            lastName: "me"
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

    const validator = () => true

    describe("Return root ordered", () => {
        it("Returns results in order of comparison strategy", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"

            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(data, searchString, comparisonStrategies, validator)
            expect(result.length).toBe(2)
            expect(result[0].firstName).toBe("mini")
            expect(result[1].firstName).toBe("Benjamin")

            comparisonStrategies = [CONTAINS, STARTS_WITH]
            result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(data, searchString, comparisonStrategies, validator)
            expect(result.length).toBe(2)
            expect(result[0].firstName).toBe("Benjamin")
            expect(result[1].firstName).toBe("mini")
        })

        it("Correctly limits results", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"
            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(data, searchString, comparisonStrategies, validator, 1)
            expect(result.length).toBe(1)
            expect(result[0].firstName).toBe("mini")
        })

        it("Correctly finds nested objects", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "Nes"
            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(data, searchString, comparisonStrategies, validator)
            expect(result.length).toBe(1)
            expect(result[0].id).toBe("1")
        })
    })

    describe("Nested Extraction", () => {
        it("Correctly extracts nested object", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = EXTRACT_ALL_NESTED(data, searchString, comparisonStrategies, validator)
            expect(result.length).toBe(1)
            expect(result[0].id).toBe("3")
        })    

        it("Correctly limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = EXTRACT_ALL_NESTED(data, searchString, comparisonStrategies, validator, 1)
            expect(result.length).toBe(1)
            expect(result[0].firstName).toBe("Benjamin")
        })
    })

    describe("Return on first found", () => {
        it("Correctly returns root object on hit", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = RETURN_ROOT_ON_FIRST_MATCH(data, searchString, comparisonStrategies, validator)
            expect(result.length).toBe(1)
            expect(result[0].id).toBe("1")
        })

        it("Correctly limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = RETURN_ROOT_ON_FIRST_MATCH(data, searchString, comparisonStrategies, validator, 1)
            expect(result.length).toBe(1)
            expect(result[0].firstName).toBe("Benjamin")
        })
    })
})