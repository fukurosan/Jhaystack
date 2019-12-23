import { deepCopyObject } from "./JsonUtility"

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


test("Deep copy works!", () => {
    const clone = deepCopyObject(data)
    const dataString = JSON.stringify(data)
    const cloneString = JSON.stringify(clone)
    expect(clone === data).toBe(false)
    expect(cloneString === dataString).toBe(true)
})