import { Jhaystack, ComparisonStrategy, ExtractionStrategy, SortingStrategy, PreProcessingStrategy, fullTextScoringStrategy } from "./index"
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
		const se = new Jhaystack().setComparisonStrategy(ComparisonStrategy.FUZZY_SEQUENCE).setExtractionStrategy(ExtractionStrategy.BY_VALUE).setDataset(data)
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
			.setExtractionStrategy(ExtractionStrategy.BY_NESTED_OBJECT)
			.setDataset(data)
		const result = se.search("dck")
		expect(result.length).toBe(1)
		expect(result[0].item.firstName).toBe("Arnold")
		expect(result[0].path[0]).toBe("lastName")
		expect(result[0].path.length).toBe(1)
	})

	it("Typical weighted setup works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy(ComparisonStrategy.BITAP)
			.setExtractionStrategy(ExtractionStrategy.BY_VALUE)
			.setWeights([[path => /lastName/.test(path.join(".")), 0.7]])
			.setDataset(data)
		const result = se.search("min")
		const higherValueWithoutWeights = result.find(document => document.value === "Flamingo")
		const lowerValueWithoutWeights = result.find(document => document.value === "Benjamin")
		expect((<SearchResult>higherValueWithoutWeights).relevance).toBeLessThan((<SearchResult>lowerValueWithoutWeights).relevance)
	})

	it("Typical setup with a limiter works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy(ComparisonStrategy.CONTAINS)
			.setExtractionStrategy(ExtractionStrategy.BY_OBJECT)
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
			.setComparisonStrategy(ComparisonStrategy.CONTAINS)
			.setExtractionStrategy(ExtractionStrategy.BY_OBJECT)
			.setDataset(data)
			.setSortingStrategy([SortingStrategy.PROPERTY.ASCENDING])
		const result = se.search("min")
		expect(result.length).toBe(2)
		expect(result[0].item.firstName).toBe("Benjamin")
	})

	it("Typical setup with a nested search result works", () => {
		const se = new Jhaystack().setComparisonStrategy(ComparisonStrategy.CONTAINS).setExtractionStrategy(ExtractionStrategy.BY_OBJECT).setDataset(data)
		const result = se.search("Nested")
		expect(result.length).toBe(1)
		expect(result[0].item.id).toBe("1")
		expect(JSON.stringify(result[0].path)).toBe(JSON.stringify(["children", 0, "nested", "text"]))
		expect(result[0].path.length).toBe(4)
	})

	it("Typical setup with filters works", () => {
		const se = new Jhaystack()
			.setComparisonStrategy(ComparisonStrategy.BITAP)
			.setExtractionStrategy(ExtractionStrategy.BY_OBJECT)
			.setFilters([])
			.setDataset(data)
		let result = se.search("min")
		expect(result.length).toBe(4)

		se.setFilters([
			(_, value) => {
				return /Benjamin/.test(value)
			}
		])
		result = se.search("min")
		expect(result.length).toBe(1)

		se.setFilters([path => !/lastName/.test(path.join("."))])
		result = se.search("min")
		expect(result.length).toBe(2)

		se.setFilters([path => /lastName/.test(path.join(".")), (path, value) => !/Duck/.test(value)])
		result = se.search("uck")
		expect(result.length).toBe(1)
	})

	it("Typical full-text search works", () => {
		const se = new Jhaystack({
			data,
			indexing: {
				enable: true,
				options: {
					preProcessors: [PreProcessingStrategy.PORTER2]
				}
			},
			fullTextScoringStrategy: fullTextScoringStrategy.FULLTEXT_COSINE
		})
		const result = se.fulltext("nest")
		expect(result.length).toBe(1)
		expect(result[0].item.id).toBe("1")
		expect(result[0].relevance).toBe(0.7071067811865475)
	})
})
