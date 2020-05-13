import EQUALS_INDEX from "./Equals"
import CONTAINS_INDEX from "./Contains"
import FULL_TEXT_INDEX from "./FullText"

describe("Indexing module", () => {

    const data = [
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

    const validator = () => true

    it("Correctly creates full text index", () => {
        const index = FULL_TEXT_INDEX(data, validator)
        expect(index["TOM"]).toBeTruthy()
        expect(index["TEM"]).toBeTruthy()
        expect(index["OM"]).toBe(undefined)
        expect(index["TOM"][0].path[0]).toBe("firstName")
        expect(index["TOM"][0].item).toEqual(data[0])
    })

    it("Correctly creates contains index", () => {
        const index = CONTAINS_INDEX(data, validator)
        expect(index["IBBI"]).toBeTruthy()
        expect(index["IBBI"][0].path[0]).toBe("lastName")
        expect(index["IBBI"][0].item).toEqual(data[2])
        expect(index[2].length).toBe(2)
    })

    it("Correctly creates equals index", () => {
        const index = EQUALS_INDEX(data, validator)
        expect(index["JIM"]).toBeTruthy()
        expect(index["JIM"][0].path[0]).toBe("firstName")
        expect(index["JIM"][0].item).toEqual(data[1])
        expect(index[2].length).toBe(2)
    })

})