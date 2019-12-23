import { attributeValidator } from "./Validation"

const includedAttributes = [
    "A",
    "B",
    "C"
]

const ignoredAttributes = [
    "A",
    "B",
    "C"
]

test("Attribute validation works!", () => {
    const attribute = "A"
    const wildAttribute = "G"
    const resultIncluded = attributeValidator(attribute, includedAttributes, null)
    const resultNotIncluded = attributeValidator(wildAttribute, includedAttributes, null)
    const resultIgnored = attributeValidator(attribute, null, ignoredAttributes)
    const resultWildCard = attributeValidator(attribute, null, null)
    expect(resultIncluded).toBe(true)
    expect(resultNotIncluded).toBe(false)
    expect(resultIgnored).toBe(false)
    expect(resultWildCard).toBe(true)
})