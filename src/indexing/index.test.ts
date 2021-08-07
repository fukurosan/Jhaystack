import { Index } from "./Index"
import { simpleDocuments, createSimpleDocumentByString } from "./__test__/testDocuments"

describe("Index Module", () => {
	const defaultOptions = {}

	const documentZeroDenseVector = [
		0.4472135954999579,
		0.4472135954999579,
		0.4472135954999579,
		0,
		0,
		0,
		0,
		0,
		0.4472135954999579,
		0,
		0.4472135954999579,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]

	const documentZeroDefaultDenseVector = [
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
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
		const fishDocument = createSimpleDocumentByString("fish")
		const fishResult = index.inexactKRetrievalByDocument(fishDocument)
		expect(fishResult.documents.length).toBe(2)
		expect(fishResult.documents).toContain(0)
		expect(fishResult.documents).toContain(1)
		expect(fishResult.queryVector).toContain(1e-15)

		//With one match
		const humanDocument = createSimpleDocumentByString("humans")
		const humanResult = index.inexactKRetrievalByDocument(humanDocument)
		expect(humanResult.documents.length).toBe(1)
		expect(humanResult.documents).toContain(1)
		expect(humanResult.queryVector).toContain(1)

		//With a filter
		const filterResult = index.inexactKRetrievalByDocument(fishDocument, [0])
		expect(filterResult.documents.length).toBe(1)
		expect(filterResult.documents).toContain(0)

		//With positional mathing
		const positionalFishDocument = createSimpleDocumentByString("other fish")
		const positionalResult = index.inexactKRetrievalByDocument(positionalFishDocument, undefined, true)
		expect(positionalResult.documents.length).toBe(1)
		expect(positionalResult.documents).toContain(0)

		//With field search
		const fieldFishResult = index.inexactKRetrievalByDocument(fishDocument, undefined, undefined, "name")
		expect(fieldFishResult.documents.length).toBe(1)
		expect(fieldFishResult.documents).toContain(0)
	})
})
