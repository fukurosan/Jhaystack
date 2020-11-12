import { VALUE, WORD, TRIGRAM, STARTS_WITH } from "./IndexStrategy"
import { flattenObject } from "../Utility/JsonUtility"

describe("Indexing module", () => {
	const data = flattenObject({
		items: [
			{
				id: 1,
				firstName: "Tim Tom Tem",
				lastName: "Bern",
				relation: [2, 3]
			},
			{
				id: 2,
				firstName: "Jim",
				lastName: "Jiggery",
				hobbies: [
					{
						name: "Dancing"
					},
					{
						name: "Tennis"
					}
				]
			},
			{
				id: 3,
				firstName: "Rich",
				lastName: "Ribbity"
			},
			{
				id: 4,
				title: "Welcome to space sir"
			}
		]
	})

	it("Creates word index", () => {
		const index = new WORD(data)
		expect(index.evaluate("TOM")[0].score).toBeTruthy()
		expect(index.evaluate("TEM")[0].score).toBeTruthy()
		expect(index.evaluate("OM").length).toBe(0)
		expect(index.evaluate("TOM")[0].shard?.path.toString()).toBe(["items", "0", "firstName"].toString())
		expect(index.evaluate("TOM")[0].shard?.value).toEqual("Tim Tom Tem")
		expect(index.tag).toBe("WORD")
	})

	it("Creates value index", () => {
		const index = new VALUE(data)
		expect(index.evaluate("JIM")[0].score).toBeTruthy()
		expect(index.evaluate("JIM")[0].shard?.path.toString()).toBe(["items", "1", "firstName"].toString())
		expect(index.evaluate("JIM")[0].shard?.value).toEqual("Jim")
		expect(index.tag).toBe("VALUE")
	})

	it("Creates trigram index", () => {
		const index = new TRIGRAM(data)
		expect(index.evaluate("BIT")[0].score).toBe(1)
		expect(index.evaluate("RI").length).toBe(0)
		expect(index.evaluate("BIT")[0].shard?.path.toString()).toBe(["items", "2", "lastName"].toString())
		expect(index.evaluate("BIT")[0].shard?.value).toEqual("Ribbity")
		expect(index.evaluate("Come to space and join us!")[0].score).toBe(12 / 24)
		expect(index.tag).toBe("TRIGRAM")
	})

	it("Creates prefix index", () => {
		const index = new STARTS_WITH(data)
		expect(index.evaluate("We")[0].score).toBe(1)
		expect(index.evaluate("WEL")[0].score).toBe(1)
		expect(index.evaluate("Welme").length).toBe(0)
		expect(index.evaluate("RI")[0].score).toBe(1)
		expect(index.evaluate("Come to space and join us!").length).toBe(0)
		expect(index.tag).toBe("STARTS_WITH")
	})
})
