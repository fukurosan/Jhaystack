import { Jhaystack, ComparisonStrategy, TraversalStrategy, SortingStrategy, IndexStrategy } from "./index"
import SearchResult from "./Model/SearchResult"

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
			firstName: "Space Man",
			lastName: "Dingo"
		},
		{
			firstName: "Alfred",
			lastName: "Amigo"
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
			.setTraversalStrategy(TraversalStrategy.FIND_VALUES)
			.setDataset(data)
		const result = se.search("dck")
		expect(result.length).toBe(1)
		expect(result[0].item.firstName).toBe("Arnold")
		expect(result[0].path[0]).toBe("lastName")
		expect(result[0].path.length).toBe(1)
	})

	it("Library correctly parses incorrectly specified comparison strategy", () => {
		const se = new Jhaystack()
			//@ts-ignore
			.setComparisonStrategy(ComparisonStrategy.FUZZY_SEQUENCE) //This is incorrectly typed on purpose
			.setTraversalStrategy(TraversalStrategy.FIND_OBJECTS)
			.setDataset(data)
		const result = se.search("dck")
		expect(result.length).toBe(1)
		expect(result[0].item.firstName).toBe("Arnold")
		expect(result[0].path[0]).toBe("lastName")
		expect(result[0].path.length).toBe(1)
	})

	it("Typical weighted setup works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy([ComparisonStrategy.BITAP])
			.setTraversalStrategy(TraversalStrategy.FIND_VALUES)
			.setWeights([[path => /lastName/.test(path.join(".")), 0.7]])
			.setDataset(data)
		const result = se.search("min")
		const higherValueWithoutWeights = result.find(item => item.value === "Flamingo")
		const lowerValueWithoutWeights = result.find(item => item.value === "Benjamin")
		expect((<SearchResult>higherValueWithoutWeights).relevance).toBeLessThan((<SearchResult>lowerValueWithoutWeights).relevance)
	})

	it("Typical setup with a limiter works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy([ComparisonStrategy.CONTAINS])
			.setTraversalStrategy(TraversalStrategy.FIND_OBJECTS)
			.setDataset(data)
			.setLimit(1)
		const result = se.search("min")
		expect(result.length).toBe(1)
		expect(result[0].item.firstName).toBe("Benjamin")
		expect(result[0].path[0]).toBe("firstName")
		expect(result[0].path.length).toBe(1)
	})

	it("Typical setup with sorting works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy([ComparisonStrategy.CONTAINS])
			.setTraversalStrategy(TraversalStrategy.FIND_OBJECTS)
			.setDataset(data)
			.setSortingStrategy([SortingStrategy.PROPERTY.ASCENDING])
		const result = se.search("min")
		expect(result.length).toBe(2)
		expect(result[0].item.firstName).toBe("Benjamin")
	})

	it("Typical setup with a nested search result works", () => {
		const se = new Jhaystack().setComparisonStrategy([ComparisonStrategy.CONTAINS]).setTraversalStrategy(TraversalStrategy.FIND_OBJECTS).setDataset(data)
		const result = se.search("Nested")
		expect(result.length).toBe(1)
		expect(result[0].item.id).toBe("1")
		expect(JSON.stringify(result[0].path)).toBe(JSON.stringify(["children", "0", "nested", "text"]))
		expect(result[0].path.length).toBe(4)
	})

	it("Typical setup with an indexed trigram search works", () => {
		const se = new Jhaystack().setIndexStrategy([IndexStrategy.TRIGRAM]).setDataset(data)
		const result = se.indexLookup("Teddy Ject")
		expect(result.length).toBe(1)
		expect(result[0]?.relevance).toBe(0.375)
		expect(result[0]?.item.id).toBe("1")
		expect(JSON.stringify(result[0]?.path)).toBe(JSON.stringify(["children", "0", "nested", "text"]))
		expect(result[0]?.path.length).toBe(4)
	})

	it("Typical setup with filters works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy([ComparisonStrategy.BITAP])
			.setTraversalStrategy(TraversalStrategy.FIND_OBJECTS)
			.setFilters([])
			.setDataset(data)
		let result = se.search("min")
		expect(result.length).toBe(5)

		se.setFilters([
			(_, value) => {
				return /Benjamin/.test(value)
			}
		])
		result = se.search("min")
		expect(result.length).toBe(1)

		se.setFilters([path => !/lastName/.test(path.join("."))])
		result = se.search("min")
		expect(result.length).toBe(4)

		se.setFilters([path => /lastName/.test(path.join(".")), (path, value) => !/Duck/.test(value)])
		result = se.search("uck")
		expect(result.length).toBe(1)
	})
})
