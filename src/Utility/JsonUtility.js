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
                result.push({
                    value: o[key],
                    path: newPath,
                    depth: newPath.length
                })
            }
            else if (thisItem !== null && typeof thisItem === "object") {
                traverse(thisItem, [...path, key])
            }
        })
    }
    traverse(object)
    result.sort((a, b) => {
        if(a.depth < b.depth) return -1
        if(a.depth > b.depth) return 1
        return 0
    })
    return result
}