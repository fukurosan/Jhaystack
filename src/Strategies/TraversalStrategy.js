export const EXTRACT_ALL_NESTED = (objectArray, searchString, comparisonStrategy, validator, limit) => {
    let hits = []
    let numberOfFound = 0
    const seen = new Set()
    objectArray.forEach(object => {
        if (limit && numberOfFound >= limit) {
            return
        }
        JSON.stringify(object, (currKey, nestedValue) => {
            if (typeof nestedValue === "object" && nestedValue !== null) {
                if (seen.has(nestedValue)) {
                    return
                }
                seen.add(nestedValue)
                Object.keys(nestedValue).forEach(key => {
                    if (typeof nestedValue[key] !== "object" && !Array.isArray(nestedValue[key]) && validator([key])) {
                        for (let i = 0; i < comparisonStrategy.length; i++) {
                            if (comparisonStrategy[i](searchString, nestedValue[key])) {
                                hits.push({
                                    path: [key],
                                    depth: 1,
                                    item: nestedValue
                                })
                                numberOfFound++
                                break
                            }
                        }
                    }
                })
            }
            return nestedValue
        })
    })
    return hits
}

export const RETURN_ROOT_ON_FIRST_MATCH = (objectArray, searchString, comparisonStrategy, validator, limit) => {
    const traverse = (object, path = []) => {
        let isHit = false
        Object.keys(object).forEach(key => {
            const nextPath = [...path, key]
            if (!isHit && validator(nextPath)) {
                const thisItem = object[key]
                if (thisItem !== null && typeof thisItem !== "object") {
                    for (let i = 0; i < comparisonStrategy.length; i++) {
                        if (comparisonStrategy[i](searchString, thisItem)) {
                            isHit = {
                                path: nextPath,
                                depth: nextPath.length
                            }
                        }
                        if (isHit) {
                            break
                        }
                    }
                }
            }
        })
        if (!isHit) {
            Object.keys(object).forEach(key => {
                if (!isHit && object[key] === Object(object[key])) {
                    isHit = traverse(object[key], [...path, key])
                }
            })
        }
        return isHit
    }

    let hits = []
    let numberOfFound = 0
    objectArray.forEach(item => {
        if (limit && numberOfFound >= limit) {
            return
        }
        const result = traverse(item)
        result &&
            (result.item = item) &&
            hits.push(result) &&
            numberOfFound++
    })
    return hits
}

export const RETURN_ROOT_ON_FIRST_MATCH_ORDERED = (objectArrayIn, searchString, comparisonStrategy, validator, limit) => {
    const traverse = (object, comparisonFunction, path = []) => {
        let isHit = false
        Object.keys(object).forEach(key => {
            const newPath = [...path, key]
            if (!isHit && validator(newPath)) {
                const thisItem = object[key]
                if (thisItem !== null && typeof thisItem !== "object") {
                    if (comparisonFunction(searchString, thisItem)) {
                        isHit = {
                            path: newPath,
                            depth: newPath.length
                        }
                    }
                }
            }
        })
        if (!isHit) {
            Object.keys(object).forEach(key => {
                if (!isHit && object[key] === Object(object[key])) {
                    isHit = traverse(object[key], comparisonFunction, [...path, key])
                }
            })
        }
        return isHit
    }

    const objectArray = [...objectArrayIn]
    let hits = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => hits.push([]))

    comparisonStrategy.forEach((comparisonFunction, strategyIndex) => {
        for (let objectIndex = 0; objectIndex < objectArray.length; objectIndex++) {
            if (limit && numberOfFound >= limit) {
                break
            }
            const isHit = traverse(objectArray[objectIndex], comparisonFunction)
            if (isHit) {
                isHit.item = objectArray.splice(objectIndex, 1)[0]
                hits[strategyIndex].push(isHit)
                numberOfFound++
                objectIndex--
            }
        }
    })

    let result = []
    hits.forEach(hitArray => {
        result = [...result, ...hitArray]
    })

    return result
}

export default {
    EXTRACT_ALL_NESTED,
    RETURN_ROOT_ON_FIRST_MATCH,
    RETURN_ROOT_ON_FIRST_MATCH_ORDERED
}