import { Index } from "./Index"
import { simpleDocuments } from "./__test__/testDocuments"

describe("Index Module", () => {
	const defaultOptions = {}

	const documentZeroDenseVector = [
		0.4472135954999579, 0.4472135954999579, 0.4472135954999579, 0, 0, 0, 0, 0, 0.4472135954999579, 0, 0.4472135954999579, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]

	const documentZeroDefaultDenseVector = [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]

	const statisticsObject = { averageDocumentLength: 17.666666666666668, id: "1", numberOfDocuments: 3, numberOfTokens: 43 }

	it("Creating an empty index works", () => {
		const index = new Index([], defaultOptions)
		expect(index.getNumberOfDocuments()).toBe(0)
	})

	it("Providing a corpus works", () => {
		const index = new Index(simpleDocuments, defaultOptions)
		expect(index.getNumberOfDocuments()).toBe(statisticsObject.numberOfDocuments)
		expect(index.getAverageDocumentLength()).toBe(statisticsObject.averageDocumentLength)
		expect(index.getDenseVectorByID(0)).toStrictEqual(documentZeroDefaultDenseVector)
		expect(index.getNumberOfTokens()).toBe(statisticsObject.numberOfTokens)
		expect(index.getNumberOfDocumentsWithTerm("ocean")).toBe(2)
	})

	it("Computing frequencies works", () => {
		const index = new Index(simpleDocuments, defaultOptions)
		index.build()
		expect(index.getDenseVectorByID(0)).toStrictEqual(documentZeroDenseVector)
		expect(index.getInverseDocumentFrequency("ocean")).toBe(0)
		expect(index.getInverseDocumentFrequency("Humans")).toBe(0.17609125905568124)
	})

	it("Inexact K Retrieval works", () => {
		const index = new Index(simpleDocuments, {
			...defaultOptions,
			preProcessors: [value => value.replace(/\./g, ""), value => value.toLowerCase()]
		})
		index.build()
		//With two matches
		const fishResult = index.inexactKRetrievalByValue("fish")
		expect(fishResult.length).toBe(2)
		expect(fishResult).toContain(0)
		expect(fishResult).toContain(1)

		//With one match
		const humanResult = index.inexactKRetrievalByValue("humans")
		expect(humanResult.length).toBe(1)
		expect(humanResult).toContain(1)

		//With a filter
		const filterResult = index.inexactKRetrievalByValue("fish", [0])
		expect(filterResult.length).toBe(1)
		expect(filterResult).toContain(0)

		//With positional mathing
		const positionalResult = index.inexactKRetrievalByValue("other fish", undefined, true)
		expect(positionalResult.length).toBe(1)
		expect(positionalResult).toContain(0)

		//With field search
		const fieldFishResult = index.inexactKRetrievalByValue("fish", undefined, undefined, "name")
		expect(fieldFishResult.length).toBe(1)
		expect(fieldFishResult).toContain(0)
	})
})
