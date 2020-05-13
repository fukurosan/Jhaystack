import { EXTRACT_ALL_NESTED, RETURN_ROOT_ON_FIRST_MATCH, RETURN_ROOT_ON_FIRST_MATCH_ORDERED } from "./TraversalStrategy"
import { STARTS_WITH, CONTAINS } from "./ComparisonStrategy"
import { flattenObject } from "../Utility/JsonUtility"

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

    const processedData = data
    .map(object => {
      return {
        original: object,
        flattened: flattenObject(object)
      }
    })

    describe("Return root ordered", () => {
        it("Returns results in order of comparison strategy", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"

            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(2)
            expect(result[0].item.firstName).toBe("mini")
            expect(result[1].item.firstName).toBe("Benjamin")

            comparisonStrategies = [CONTAINS, STARTS_WITH]
            result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(2)
            expect(result[0].item.firstName).toBe("Benjamin")
            expect(result[1].item.firstName).toBe("mini")
        })

        it("Correctly limits results", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"
            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("mini")
        })

        it("Correctly finds nested objects", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "Nes"
            let result = RETURN_ROOT_ON_FIRST_MATCH_ORDERED(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("1")
        })
    })

    describe("Nested Extraction", () => {
        it("Correctly extracts nested object", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = EXTRACT_ALL_NESTED(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("3")
        })    

        it("Correctly limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = EXTRACT_ALL_NESTED(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("Benjamin")
        })
    })

    describe("Return on first found", () => {
        it("Correctly returns root object on hit", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = RETURN_ROOT_ON_FIRST_MATCH(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("1")
        })

        it("Correctly limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = RETURN_ROOT_ON_FIRST_MATCH(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("Benjamin")
        })
    })
})