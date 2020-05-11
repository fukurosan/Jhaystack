export const EXTRACT_ALL_NESTED = (objectArray, searchString, comparisonStrategy, validator, limit) => {
    let hits = []
    let numberOfFound = 0
    const seen = new WeakSet()
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
                    if (typeof nestedValue[key] !== "object" && !Array.isArray(nestedValue[key]) && validator(key)) {
                        for (let i = 0; i < comparisonStrategy.length; i++) {
                            if (comparisonStrategy[i](searchString, nestedValue[key])) {
                                hits.push(nestedValue)
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
    let hits = []
    let numberOfFound = 0
    const traverse = (object) => {
        let isHit = false
        Object.keys(object).forEach(key => {
            if (validator(key) && !isHit) {
                const thisItem = object[key]
                if (thisItem !== null && typeof thisItem !== "object" && !isHit) {
                    for (let i = 0; i < comparisonStrategy.length; i++) {
                        isHit = comparisonStrategy[i](searchString, thisItem)
                        if (isHit) {
                            break
                        }
                    }
                }
            }
        })
        if (!isHit) {
            Object.keys(object).forEach(key => {
                if (object[key] === Object(object[key])) {
                    if (traverse(object[key])) {
                        isHit = true
                    }
                }
            })
        }
        return isHit
    }

    objectArray.forEach(item => {
        if(limit && numberOfFound >= limit) {
            return
        }
        traverse(item, searchString) && 
        hits.push(item) && 
        numberOfFound++
    })

    return hits
}

export const RETURN_ROOT_ON_FIRST_MATCH_ORDERED = (objectArrayIn, searchString, comparisonStrategy, validator, limit) => {
    const objectArray = [...objectArrayIn]
    let hits = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => hits.push([]))

    const traverse = (object, comparisonFunction) => {
        let isHit = false
        Object.keys(object).forEach(key => {
            if (validator(key) && !isHit) {
                const thisItem = object[key]
                if (thisItem !== null && typeof thisItem !== "object" && !isHit) {
                    isHit = comparisonFunction(searchString, thisItem)
                }
            }
        })
        if (!isHit) {
            Object.keys(object).forEach(key => {
                if (object[key] === Object(object[key]) && !isHit) {
                    if (traverse(object[key], comparisonFunction)) {
                        isHit = true
                    }
                }
            })
        }
        return isHit
    }

    comparisonStrategy.forEach((comparisonFunction, strategyIndex) => {
        for (let objectIndex = 0; objectIndex < objectArray.length; objectIndex++) {
            if(limit && numberOfFound >= limit) {
                return
            }
            const isHit = traverse(objectArray[objectIndex], comparisonFunction)
            if (isHit) {
                const foundObject = objectArray.splice(objectIndex, objectIndex === 0 ? 1 : objectIndex)[0]
                hits[strategyIndex].push(foundObject)
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