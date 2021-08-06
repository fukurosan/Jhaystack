import { KMeans } from "./clusterStrategy"
import Document from "../../Model/Document"

describe("Clustering Strategy Module", () => {
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
