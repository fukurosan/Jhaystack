export const EXTRACT_ALL_NESTED = (objectArray, searchString, comparisonStrategy, validator) => {
    let hits = []
    const seen = new WeakSet()
    objectArray.forEach(object => {
        JSON.stringify(object, (currKey, nestedValue) => {
            if (typeof nestedValue === "object" && nestedValue !== null) {
                if (seen.has(nestedValue)) {
                    return
                }
                seen.add(nestedValue)
                Object.keys(nestedValue).forEach(key => {
                    if (typeof nestedValue[key] !== "object" && !Array.isArray(nestedValue[key])) {
                        if (validator(key) && comparisonStrategy(searchString, nestedValue[key])) {
                            hits.push(nestedValue)
                        }
                    }
                })
            }
            return nestedValue
        })
    })
    return hits
}

export const RETURN_ROOT_ON_FIRST_FOUND = (objectArray, searchString, comparisonStrategy, validator) => {
    let hits = []

    const traverse = (object, searchString) => {
        let isHit = false
        Object.keys(object).forEach(key => {
            if (validator(key)) {
                const thisItem = object[key]
                if (thisItem !== null && typeof thisItem !== "object") {
                    if (!isHit) {
                        isHit = comparisonStrategy(searchString, thisItem)
                    }
                }
            }
        })
        if (isHit) {
            return true
        }
        else {
            Object.keys(object).forEach(key => {
                if (object[key] === Object(object[key])) {
                    if (traverse(object[key], searchString)) {
                        return true
                    }
                }
            })
        }
        return false
    }

    objectArray.forEach(item => {
        traverse(item, searchString) && hits.push(item)
    })

    return hits
}

export default {
    EXTRACT_ALL_NESTED,
    RETURN_ROOT_ON_FIRST_FOUND
}