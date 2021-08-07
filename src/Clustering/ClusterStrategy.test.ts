import { KMeans, Range } from "./clusterStrategy"
import Document from "../Model/Document"
import Declaration from "../Model/Declaration"

describe("Clustering Strategy Module", () => {
	it("Range works", () => {
		let nextID = 0
		const documents = [
			{
				number: 1
			},
			{
				number: 2
			},
			{
				number: 3
			},
			{
				number: 4
			},
			{
				number: 5
			},
			{
				number: 6
			}
		]
			.map((obj, i) => new Document(++nextID, obj, i, [new Declaration(obj.number, ["number"])]))
			.map(doc => ({
				document: doc,
				tokenMap: new Map(),
				vector: []
			}))
		const rangeCluster = new Range("1", { field: "number" })
		rangeCluster.build(documents)
		const testDocument = documents[0] //This is irrelevant to the cluster
		const lt = rangeCluster.evaluate(testDocument, { lessThan: 5 })
		const gt = rangeCluster.evaluate(testDocument, { greaterThan: 2 })
		const range = rangeCluster.evaluate(testDocument, { lessThan: 5, greaterThan: 2 })
		expect(lt.length).toBe(4)
		expect(gt.length).toBe(4)
		expect(range.length).toBe(2)
		expect(range).toContain(3)
		expect(range).toContain(4)
	})

	it("KMeans works", () => {
		const documents = [
			{
				document: new Document(1, {}, 0, []),
				tokenMap: new Map(),
				vector: [1, 0, 0, 0]
			},
			{
				document: new Document(2, {}, 0, []),
				tokenMap: new Map(),
				vector: [10, 0, 0, 0]
			},
			{
				document: new Document(3, {}, 0, []),
				tokenMap: new Map(),
				vector: [1, 1, 0, 0]
			},
			{
				document: new Document(4, {}, 0, []),
				tokenMap: new Map(),
				vector: [10, 10, 0, 0]
			},
			{
				document: new Document(5, {}, 0, []),
				tokenMap: new Map(),
				vector: [1, 1, 1, 0]
			},
			{
				document: new Document(6, {}, 0, []),
				tokenMap: new Map(),
				vector: [10, 10, 10, 0]
			},
			{
				document: new Document(7, {}, 0, []),
				tokenMap: new Map(),
				vector: [1, 1, 1, 1]
			},
			{
				document: new Document(8, {}, 0, []),
				tokenMap: new Map(),
				vector: [10, 10, 10, 10]
			}
		]
		const statistics = {
			numberOfDocuments: 8,
			numberOfTokens: 4,
			averageDocumentLength: 4
		}
		const kmeans = new KMeans(1, {})
		kmeans.build(documents, statistics)
		const clustermap = kmeans.getClusterMap()
		const leaders = [...clustermap.keys()]
		const followers = [...clustermap.values()]
		expect(leaders.length).toBe(2)
		expect(followers[0].length).not.toBe(followers[1].length) //In this case the length may vary, but one should always be longer than the other.
	})
})
