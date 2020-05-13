import { attributeValidator } from "./Validation"

describe("Validation Module", () => {
    const includedAttributes = {
        "A": true,
        "B": true,
        "C": true
    }

    const ignoredAttributes = {
        "A": true,
        "B": true,
        "C": true
    }

    it("Validates attributes", () => {
        const attribute = "A"
        const wildAttribute = "G"
        const resultIncluded = attributeValidator([attribute], includedAttributes, null)
        const resultNotIncluded = attributeValidator([wildAttribute], includedAttributes, null)
        const resultIgnored = attributeValidator([attribute], null, ignoredAttributes)
        const resultWildCard = attributeValidator([attribute], null, null)
        expect(resultIncluded).toBe(true)
        expect(resultNotIncluded).toBe(false)
        expect(resultIgnored).toBe(false)
        expect(resultWildCard).toBe(true)
    })

    it("Interprets array key as outer object key", () => {
        const includedAttributes = { "hello": true }
        const resultIncluded = attributeValidator(["hello", "0"], includedAttributes, null)
        expect(resultIncluded).toBe(true)
    })
})