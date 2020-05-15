import Shard from "../Model/Shard"

export const deepCopyObject = (o) => {
    let out = Array.isArray(o) ? [] : {}
    for (let key in o) {
        let v = o[key]
        out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
    }
    return out
}

export const flattenObject = (object) => {
    let result = []
    const traverse = (o, path = []) => {
        Object.keys(o).forEach(key => {
            const newPath = [...path, key]
            const thisItem = o[key]
            if (thisItem !== null && typeof thisItem !== "object") {
                result.push(new Shard(o[key], newPath))
            }
            else if (thisItem !== null && typeof thisItem === "object") {
                traverse(thisItem, [...path, key])
            }
        })
    }
    traverse(object)
    result.sort((a, b) => {
        if (a.depth < b.depth) return -1
        if (a.depth > b.depth) return 1
        return 0
    })
    return result
}

export const getLastNonNumericItemInArray = (array) => {
    let lastValidKey
    let index = array.length - 1
    while (!lastValidKey) {
        if (index === -1) {
            lastValidKey = null
            break
        }
        if (Number.isNaN(+array[index])) {
            lastValidKey = array[index]
        }
        else {
            index--
        }
    }
    return lastValidKey
}