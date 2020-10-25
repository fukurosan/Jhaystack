import { FIND_NESTED_OBJECTS, FIND_OBJECTS, FIND_VALUES } from "./TraversalStrategy"
import { STARTS_WITH, CONTAINS } from "../Comparison/ComparisonStrategy"
import Item from "../Model/Item"

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
            return new Item(object, [], [], [])
        })

    const repetitionData = [
        {
            id: 1,
            name: "Jimmy Fridge",
            nameTwo: "Jimmy Jam"
        },
        {
            id: 2,
            name: "Jimmy Oven"
        },
        {
            id: 2,
            name: "Jimmy Ham"
        }
    ].map(object => {
        return new Item(object, [], [], [])
    })

    const mixedDataTypes = [
        {
            name: "Jimmy Fridge",
        },
        "Jimmy Oven",
        ["Jimmy Ham"]
    ].map(object => {
        return new Item(object, [], [], [])
    })

    describe("Find Values", () => {
        it("Returns results in order of comparison strategy", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"
            let result = FIND_VALUES(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(2)
            expect(result[0].item.firstName).toBe("mini")
            expect(result[1].item.firstName).toBe("Benjamin")

            comparisonStrategies = [CONTAINS, STARTS_WITH]
            result = FIND_VALUES(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(2)
            expect(result[0].item.firstName).toBe("Benjamin")
            expect(result[1].item.firstName).toBe("mini")
        })

        it("Limits results", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "min"
            let result = FIND_VALUES(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("mini")
        })

        it("Finds nested objects", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            let searchString = "Nes"
            let result = FIND_VALUES(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("1")
        })

        it("Handles object repetition", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            const searchResult = FIND_VALUES(repetitionData, "Jimmy", comparisonStrategies, 2)
            expect(searchResult[0].item.id).toBe(1)
            expect(searchResult[1].item.id).toBe(1)
            expect(searchResult.length).toBe(2)
        })

        it("Handles various data types", () => {
            let comparisonStrategies = [STARTS_WITH]
            const searchResult = FIND_VALUES(mixedDataTypes, "Jimmy", comparisonStrategies)
            expect(searchResult.length).toBe(3)
            expect(searchResult[0].value).toBe("Jimmy Fridge")
            expect(searchResult[1].value).toBe("Jimmy Oven")
            expect(searchResult[2].value).toBe("Jimmy Ham")
        })
    })

    describe("Find Nested Objects", () => {
        it("Extracts nested object", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = FIND_NESTED_OBJECTS(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("3")
        })

        it("Limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = FIND_NESTED_OBJECTS(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("Benjamin")
        })

        it("Considers arrays as absolute values", () => {
            const arrayInNestedData = [
                {
                    someProperty: {
                        someOtherProperty: {
                            someThirdProperty: [
                                [
                                    [
                                        "Nested Object"
                                    ],
                                    [
                                        "Nested Object 2"
                                    ]
                                ]
                            ]
                        }
                    }
                }
            ].map(object => {
                return new Item(object, [], [], [])
            })
            let comparisonStrategies = [STARTS_WITH]
            let searchString = "Nested"
            let result = FIND_NESTED_OBJECTS(arrayInNestedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].path.length).toBe(3)
            expect(result[0].path[0]).toBe("0")
            expect(result[0].value).toBe("Nested Object")
        })

        it("Handles various data types", () => {
            let comparisonStrategies = [STARTS_WITH]
            const searchResult = FIND_NESTED_OBJECTS(mixedDataTypes, "Jimmy", comparisonStrategies)
            expect(searchResult.length).toBe(3)
            expect(searchResult[0].value).toBe("Jimmy Fridge")
            expect(searchResult[1].value).toBe("Jimmy Oven")
            expect(searchResult[2].value).toBe("Jimmy Ham")
        })
    })

    describe("Find Objects", () => {
        it("Returns root object on hit", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "obj"
            let result = FIND_OBJECTS(processedData, searchString, comparisonStrategies)
            expect(result.length).toBe(1)
            expect(result[0].item.id).toBe("1")
        })

        it("Limits results", () => {
            let comparisonStrategies = [CONTAINS]
            let searchString = "min"
            let result = FIND_OBJECTS(processedData, searchString, comparisonStrategies, 1)
            expect(result.length).toBe(1)
            expect(result[0].item.firstName).toBe("Benjamin")
        })

        it("Handles object repetition", () => {
            let comparisonStrategies = [STARTS_WITH, CONTAINS]
            const searchResult = FIND_OBJECTS(repetitionData, "Jimmy", comparisonStrategies, 2)
            expect(searchResult[0].item.id).toBe(1)
            expect(searchResult[1].item.id).toBe(2)
            expect(searchResult.length).toBe(2)
        })

        it("Handles various data types", () => {
            let comparisonStrategies = [STARTS_WITH]
            const searchResult = FIND_OBJECTS(mixedDataTypes, "Jimmy", comparisonStrategies)
            expect(searchResult.length).toBe(3)
            expect(searchResult[0].value).toBe("Jimmy Fridge")
            expect(searchResult[1].value).toBe("Jimmy Oven")
            expect(searchResult[2].value).toBe("Jimmy Ham")
        })
    })
})