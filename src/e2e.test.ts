import { Jhaystack, ComparisonStrategy, ExtractionStrategy, SortingStrategy, PreProcessingStrategy, FullTextScoringStrategy } from "./index"
import { IIndexVector } from "./Model/IFullTextScoring"
import SearchResult from "./Model/SearchResult"
import { NGRAM } from "./Spelling/Ngram"

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

	it("Typical async search works", async () => {
		const contains = (term: any, context: any) => {
			return context.toLowerCase().includes(term.toLowerCase()) ? 1 : 0
		}
		const se = new Jhaystack().setComparisonStrategy(contains).setExtractionStrategy(ExtractionStrategy.BY_VALUE).setDataset(data)
		const result = await se.searchAsync("duck")
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
			fullTextScoringStrategy: FullTextScoringStrategy.FULLTEXT_COSINE
		})
		const result = se.fulltext("nest")
		expect(result.length).toBe(1)
		expect(result[0].item.id).toBe("1")
		expect(result[0].relevance).toBe(0.7071067811865475)
	})

	it("Typical full-text-async search works", async () => {
		/*
		 * Because of istanbul code coverage reports interfering with function serialization
		 * we basically need to redefine this whole function here.
		 * https://github.com/gotwarlost/istanbul/issues/445
		 */
		const FULLTEXT_COSINE_COPY = (vector1: IIndexVector, vector2: IIndexVector): number => {
			const v1 = vector1.vector
			const v2 = vector2.vector
			const isVector1UnitLength = vector1.isUnitLength
			const isVector2UnitLength = vector2.isUnitLength
			let dotProduct = 0
			let vector1Length = 1
			let vector2Length = 1
			for (let i = 0; i < v1.length; i++) {
				dotProduct += v1[i] * v2[i]
				if (!isVector1UnitLength) {
					vector1Length += v1[i] ** 2
				}
				if (!isVector2UnitLength) {
					vector2Length += v2[i] ** 2
				}
			}
			if (!isVector1UnitLength) {
				vector1Length = Math.sqrt(vector1Length)
			}
			if (!isVector2UnitLength) {
				vector2Length = Math.sqrt(vector2Length)
			}
			return dotProduct / (vector1Length * vector2Length)
		}
		const se = new Jhaystack({
			data,
			indexing: {
				enable: true,
				options: {
					preProcessors: [PreProcessingStrategy.PORTER2]
				}
			},
			fullTextScoringStrategy: FULLTEXT_COSINE_COPY
		})
		const result = await se.fulltextAsync("nest")
		expect(result.length).toBe(1)
		expect(result[0].item.id).toBe("1")
		expect(result[0].relevance).toBe(0.7071067811865475)
	})

	it("Typical spelling check works", () => {
		const se = new Jhaystack({
			data,
			spelling: {
				strategy: [
					{
						id: "ngram",
						speller: NGRAM
					}
				]
			}
		})
		const result = se.checkSpelling("arnlo")
		expect(result.result).toBe("arnold")
		expect(result.corrections.length).toBe(1)
		expect(result.corrections[0].word).toBe("arnlo")
		expect(result.corrections[0].suggestion).toBe("arnold")
	})
})
