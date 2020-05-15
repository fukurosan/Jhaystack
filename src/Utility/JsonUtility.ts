import Shard from "../Model/Shard"

interface ObjectLiteral {
    [key: string]: any
}

export const deepCopyObject = <T>(o: T): any => {    
    if (o === null) {
        return o
    }
    if (o instanceof Array) {
        const out: any[] = []
        for (let key in o) {
            let v = o[key]
            out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
        }
        return out 
    }
    if (typeof o === "object" && o !== {}) {
        const out: ObjectLiteral = {}
        for (let key in o) {
            let v = o[key]
            out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
        }
        return out
    }
    if (o instanceof Date) {
        return new Date(o.getTime())
    }
}

export const flattenObject = (object: ObjectLiteral) => {
    let result: Shard[] = []
    const traverse = (o: ObjectLiteral, path: String[] = []) => {
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

export const getLastNonNumericItemInArray = (array: (String|Number)[]) => {
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