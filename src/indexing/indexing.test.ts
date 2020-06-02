import { VALUE, WORD, TRIGRAM } from "./IndexingStrategy"
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
        expect(index.evaluate("TOM").relevance).toBeTruthy()
        expect(index.evaluate("TEM").relevance).toBeTruthy()
        expect(index.evaluate("OM").relevance).toBe(0)
        expect(index.evaluate("TOM").shard?.path.toString()).toBe(["items", "0", "firstName"].toString())
        expect(index.evaluate("TOM").shard?.value).toEqual("Tim Tom Tem")
        expect(index.tag).toBe("WORD")
    })

    it("Creates value index", () => {
        const index = new VALUE(data)
        expect(index.evaluate("JIM").relevance).toBeTruthy()
        expect(index.evaluate("JIM").shard?.path.toString()).toBe(["items", "1", "firstName"].toString())
        expect(index.evaluate("JIM").shard?.value).toEqual("Jim")
        expect(index.tag).toBe("VALUE")
    })

    it("Creates trigram index", () => {
        const index = new TRIGRAM(data)
        expect(index.evaluate("BIT").relevance).toBe(1)
        expect(index.evaluate("RI").relevance).toBe(0)
        expect(index.evaluate("BIT").shard?.path.toString()).toBe(["items", "2", "lastName"].toString())
        expect(index.evaluate("BIT").shard?.value).toEqual("Ribbity")
        expect(index.evaluate("Come to space and join us!").relevance).toBe(12/22)
        expect(index.tag).toBe("TRIGRAM")
    })

})