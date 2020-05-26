import { CHARACTER, VALUE, WORD, NGRAM } from "./IndexingStrategy"
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
            }
        ]
    })

    it("Creates word index", () => {
        const index = new WORD(data)
        expect(index.evaluate("TOM")).toBeTruthy()
        expect(index.evaluate("TEM")).toBeTruthy()
        expect(index.evaluate("OM")).toBe(undefined)
        expect(index.evaluate("TOM")[0].path.toString()).toBe(["items", "0", "firstName"].toString())
        expect(index.evaluate("TOM")[0].value).toEqual("Tim Tom Tem")
        expect(index.tag).toBe("WORD")
    })

    it("Creates character index", () => {
        const index = new CHARACTER(data)
        expect(index.evaluate("IBBI")).toBeTruthy()
        expect(index.evaluate("IBBI")[0].path.toString()).toBe(["items", "2", "lastName"].toString())
        expect(index.evaluate("IBBI")[0].value).toEqual("Ribbity")
        expect(index.tag).toBe("CHARACTER")
    })

    it("Creates value index", () => {
        const index = new VALUE(data)
        expect(index.evaluate("JIM")).toBeTruthy()
        expect(index.evaluate("JIM")[0].path.toString()).toBe(["items", "1", "firstName"].toString())
        expect(index.evaluate("JIM")[0].value).toEqual("Jim")
        expect(index.tag).toBe("VALUE")
    })

    it("Creates ngram index", () => {
        const index = new NGRAM(data)
        expect(index.evaluate("BIT")).toBeTruthy()
        expect(index.evaluate("RI")).toBe(undefined)
        expect(index.evaluate("BIT")[0].path.toString()).toBe(["items", "2", "lastName"].toString())
        expect(index.evaluate("BIT")[0].value).toEqual("Ribbity")
        expect(index.tag).toBe("NGRAM")
    })

})