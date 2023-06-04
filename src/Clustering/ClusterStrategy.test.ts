import { KMeans, Range, NaiveBayes } from "./clusterStrategy"
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
		const clustermap = kmeans.getData()
		const leaders = [...clustermap.keys()]
		const followers = [...clustermap.values()]
		expect(leaders.length).toBe(2)
		expect(followers[0].length).not.toBe(followers[1].length) //In this case the length may vary, but one should always be longer than the other.
	})

	it("NaiveBayes works", () => {
		const trainingSet = [
			["I love BBQ outside in the sun.", "positive"],
			["Yesterday's pizza was epic. Super delicious", "positive"],
			["Fresh pinapple on a hot day is fantastic. I love it.", "positive"],
			["Nothing beats an amazing breakfast buffet.", "positive"],
			["Everyone is happy when dinner is served.", "positive"],

			["I hate BBQ outside on a rainy day.", "negative"],
			["Yesterday's pizza was disgusting and made me want to vomit.", "negative"],
			["Fresh pineapple sucks and burns my tongue.", "negative"],
			["Breakfast buffets are nasty in my opinion.", "negative"],
			["No one is happy when dinner is served.", "negative"]
		]
		const NaiveBayesCluster = new NaiveBayes("1", { training: <[string, string][]>trainingSet })

		const documents = [
			{
				document: new Document(0, "Love great super delicious fantastic", 0, [new Declaration("Love great super delicious fantastic", [])]),
				tokenMap: new Map(),
				vector: []
			},
			{
				document: new Document(1, "disgusting vomit hate sucks", 1, [new Declaration("disgusting vomit hate sucks", [])]),
				tokenMap: new Map(),
				vector: []
			}
		]

		NaiveBayesCluster.build(documents)
		const testDocumentPositive = {
			document: new Document(-1, "I heard pineapple is delicious for breakfast.", -1, [
				new Declaration("I heard pineapple is delicious for breakfast.", [])
			]),
			tokenMap: new Map(),
			vector: []
		}
		const testDocumentNegative = {
			document: new Document(-1, "I hate having to eat breakfast.", -1, [new Declaration("I hate having to eat breakfast.", [])]),
			tokenMap: new Map(),
			vector: []
		}
		expect(NaiveBayesCluster.evaluate(testDocumentPositive)[0]).toBe(0)
		expect(NaiveBayesCluster.evaluate(testDocumentNegative)[0]).toBe(1)
		expect(NaiveBayesCluster.evaluate({ document: new Document(-1, "", -1, []), tokenMap: new Map(), vector: []}, { category: "positive" })[0]).toBe(0)
	})
})
