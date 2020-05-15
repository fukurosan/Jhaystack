import { deepCopyObject, flattenObject, getLastNonNumericItemInArray } from "./JsonUtility"

describe("JSON Utility Module", () => {
    const data = {
        id: "1",
        children: [
            {
                id: "2"
            },
            {
                id: "3",
                children: [
                    {
                        id: 4
                    },
                    {
                        id: 5
                    }
                ]
            }
        ]
    }

    it("Deep copy works", () => {
        const clone = deepCopyObject(data)
        const dataString = JSON.stringify(data)
        const cloneString = JSON.stringify(clone)
        expect(clone === data).toBe(false)
        expect(cloneString === dataString).toBe(true)
    })

    it("Object flattening works", () => {
        const flattened = flattenObject(data)
        expect(flattened.length).toBe(5)
    })

    it("Extracting last non-numeric item from array works", () => {
        const path1 = ["something", "0", 1, "something else"]
        const path2 = ["something", "0", 1]
        const path3 = ["0"]
        expect(getLastNonNumericItemInArray(path1)).toBe("something else")
        expect(getLastNonNumericItemInArray(path2)).toBe("something")
        expect(getLastNonNumericItemInArray(path3)).toBe(null)
    })
})