import { FULL_SCAN, FULL_SCAN_ASYNC } from "./Scan"
import { BY_OBJECT } from "../Extraction/ByObject"
import { STARTS_WITH, CONTAINS } from "../Comparison/ComparisonStrategy"
import Document from "../Model/Document"
import IComparison from "../Model/IComparison"

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
		return new Document(0, object, 0, BY_OBJECT(object)[0])
	})

	const mixedDataTypes = [
		{
			name: "Jimmy Fridge"
		},
		"Jimmy Oven",
		["Jimmy Ham"]
	].map(object => {
		return new Document(0, object, 0, BY_OBJECT(object)[0])
	})

	describe("Full scan", () => {
		it("Returns root object on hit", () => {
			const comparisonStrategy = CONTAINS
			const searchString = "obj"
			const result = FULL_SCAN(processedData, searchString, comparisonStrategy)
			expect(result.length).toBe(1)
			expect(result[0].item.id).toBe("1")
		})

		it("Limits results", () => {
			const comparisonStrategy = CONTAINS
			const searchString = "min"
			const result = FULL_SCAN(processedData, searchString, comparisonStrategy, 1)
			expect(result.length).toBe(1)
			expect(result[0].item.firstName).toBe("Benjamin")
		})

		it("Handles various data types", () => {
			const comparisonStrategy = STARTS_WITH
			const searchResult = FULL_SCAN(mixedDataTypes, "Jimmy", comparisonStrategy)
			expect(searchResult.length).toBe(3)
			expect(searchResult[0].value).toBe("Jimmy Fridge")
			expect(searchResult[1].value).toBe("Jimmy Oven")
			expect(searchResult[2].value).toBe("Jimmy Ham")
		})
	})

	describe("Async full scan", () => {
		//We have to define a local strategy here because of a problem in nyc/istanbul code coverage computation
		//nyc/instabul will overwrite the native toString implementation on the function prototype, which causes problems with worker serialization
		const strategy = (term: string, context: string) => {
			return context.indexOf(term) > -1 ? 1 : 0
		}

		it("Returns root object on hit", async () => {
			const comparisonStrategy = <IComparison>strategy
			const searchString = "obj"
			const result = await FULL_SCAN_ASYNC(processedData, searchString, comparisonStrategy)
			expect(result.length).toBe(1)
			expect(result[0].item.id).toBe("1")
		})

		it("Limits results", async () => {
			const comparisonStrategy = <IComparison>strategy
			const searchString = "min"
			const result = await FULL_SCAN_ASYNC(processedData, searchString, comparisonStrategy, 1)
			expect(result.length).toBe(1)
		})

		it("Handles various data types", async () => {
			const comparisonStrategy = <IComparison>strategy
			const searchResult = await FULL_SCAN_ASYNC(mixedDataTypes, "Jimmy", comparisonStrategy)
			expect(searchResult.length).toBe(3)
			const resultsByValue = searchResult.map(result => result.value)
			expect(resultsByValue).toContain("Jimmy Fridge")
			expect(resultsByValue).toContain("Jimmy Oven")
			expect(resultsByValue).toContain("Jimmy Ham")
		})
	})
})
