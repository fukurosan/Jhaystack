import SearchEngine from "./SearchEngine"

const data = [
    {
        firstName: "Arnold",
        lastName: "Duck"
    },
    {
        firstName: "Benjamin",
        lastName: "Chicken"
    },
    {
        firstName: "Elisa",
        lastName: "Flamingo"
    },
    {
        id: "1",
        children: [
            {
                id: "2",
                nested: {
                    id: "3",
                    text: "Nested object"
                }
            }
        ]
    }
]

test("Regular search finds correct amount of hits", () => {
    const se = new SearchEngine(null, null)
    const result = se.search(data, "duck")
    expect(result.strict.length).toBe(1)
    expect(result.fuzzy.length).toBe(0)
})

test("Fuzzy search finds correct amount of hits", () => {
    const se = new SearchEngine(null, null)
    const result = se.search(data, "min")
    expect(result.strict.length).toBe(0)
    expect(result.fuzzy.length).toBe(2)
})

test("Fuzzy search finds correct hit", () => {
    const se = new SearchEngine(null, null)
    const result = se.search(data, "dck")
    expect(result.fuzzy[0].firstName).toBe("Arnold")
})

test("Extracting nested objects works", () => {
    const se = new SearchEngine(null, null)
    const result = se.extractNestedObjects(data, "id", "3")
    expect(result.length === 1)
    expect(result[0].text).toBe("Nested object")
})