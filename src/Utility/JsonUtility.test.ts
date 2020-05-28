import { deepCopyObject, flattenObject, getLastNonNumericItemInArray, mergeArraySortFunctions } from "./JsonUtility"

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
    
    it("Sorting arrays by multiple criteria works", () => {
        const dataArray = [
            {
                number: 3,
                letter: "a"
            },
            {
                number: 1,
                letter: "a"
            },
            {
                number: 2,
                letter: "c"
            },
            {
                number: 2,
                letter: "b"
            }
        ]
        const sortByNumber = (a: any, b: any) => {
            if (a.number < b.number) return -1
            if (a.number > b.number) return 1
            return 0
        }
        const sortByLetter = (a: any, b: any) => {
            if (a.letter < b.letter) return -1
            if (a.letter > b.letter) return 1
            return 0
        }

        const numberLetter = mergeArraySortFunctions([sortByNumber, sortByLetter])
        const letterNumber = mergeArraySortFunctions([sortByLetter, sortByNumber])
        const letter = mergeArraySortFunctions([sortByLetter])

        let result = []

        result = [...dataArray].sort(numberLetter)
        expect(result[0].letter).toBe("a")
        expect(result[1].letter).toBe("b")
        expect(result[2].letter).toBe("c")
        expect(result[3].letter).toBe("a")

        result = [...dataArray].sort(letterNumber)
        expect(result[0].letter).toBe("a")
        expect(result[0].number).toBe(1)
        expect(result[1].letter).toBe("a")
        expect(result[2].letter).toBe("b")
        expect(result[3].letter).toBe("c")

        result = [...dataArray].sort(letter)
        expect(result[0].letter).toBe("a")
        expect(result[0].number).toBe(3)
        expect(result[1].letter).toBe("a")
        expect(result[2].letter).toBe("b")
        expect(result[3].letter).toBe("c")
        
    })
})