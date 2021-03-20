import { FULL_SCAN } from "./Scan"
import { BY_OBJECT } from "../Extraction/ByObject"
import { STARTS_WITH, CONTAINS } from "../Comparison/ComparisonStrategy"
import Document from "../Model/Document"

describe("Scan", () => {
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

	const processedData = data.map(object => {
		return new Document(object, 0, BY_OBJECT(object)[0], [], [])
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
		return new Document(object, 0, BY_OBJECT(object)[0], [], [])
	})

	const mixedDataTypes = [
		{
			name: "Jimmy Fridge"
		},
		"Jimmy Oven",
		["Jimmy Ham"]
	].map(object => {
		return new Document(object, 0, BY_OBJECT(object)[0], [], [])
	})

	describe("Full scan", () => {
		it("Returns root object on hit", () => {
			const comparisonStrategies = [CONTAINS]
			const searchString = "obj"
			const result = FULL_SCAN(processedData, searchString, comparisonStrategies)
			expect(result.length).toBe(1)
			expect(result[0].item.id).toBe("1")
		})

		it("Limits results", () => {
			const comparisonStrategies = [CONTAINS]
			const searchString = "min"
			const result = FULL_SCAN(processedData, searchString, comparisonStrategies, 1)
			expect(result.length).toBe(1)
			expect(result[0].item.firstName).toBe("Benjamin")
		})

		it("Handles object repetition", () => {
			const comparisonStrategies = [STARTS_WITH, CONTAINS]
			const searchResult = FULL_SCAN(repetitionData, "Jimmy", comparisonStrategies, 2)
			expect(searchResult[0].item.id).toBe(1)
			expect(searchResult[1].item.id).toBe(2)
			expect(searchResult.length).toBe(2)
		})

		it("Handles various data types", () => {
			const comparisonStrategies = [STARTS_WITH]
			const searchResult = FULL_SCAN(mixedDataTypes, "Jimmy", comparisonStrategies)
			expect(searchResult.length).toBe(3)
			expect(searchResult[0].value).toBe("Jimmy Fridge")
			expect(searchResult[1].value).toBe("Jimmy Oven")
			expect(searchResult[2].value).toBe("Jimmy Ham")
		})
	})
})
