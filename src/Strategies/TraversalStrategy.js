export const EXTRACT_ALL_NESTED = (objectArray, searchString, comparisonStrategy, limit) => {
    let result = []
    let numberOfFound = 0
    objectArray.forEach(object => {
        if (limit && numberOfFound >= limit) {
            return
        }
        object.flattened.filter(flattenedItem => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, flattenedItem.value)))
            .forEach(flattenedItem => {
                if (limit && numberOfFound >= limit) {
                    return
                }
                result.push({
                    item: flattenedItem.path.slice(0, flattenedItem.path.length - 1).reduce((acc, current) => { return acc[current] }, object.original),
                    path: flattenedItem.path[flattenedItem.path.length - 1],
                    depth: 1
                })
            })
        numberOfFound++
    })
    return result
}

export const RETURN_ROOT_ON_FIRST_MATCH = (objectArray, searchString, comparisonStrategy, limit) => {
    let result = []
    let numberOfFound = 0
    objectArray.forEach(object => {
        if (limit && numberOfFound >= limit) {
            return
        }
        const isHit = object.flattened.find(flattenedItem => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, flattenedItem.value)))
        if (isHit) {
            result.push({
                item: object.original,
                path: isHit.path,
                depth: isHit.depth
            })
            numberOfFound++
        }
    })
    return result
}

export const RETURN_ROOT_ON_FIRST_MATCH_ORDERED = (objectArrayIn, searchString, comparisonStrategy, limit) => {
    const objectArray = [...objectArrayIn]
    let hits = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => hits.push([]))

    comparisonStrategy.forEach((comparisonFunction, strategyIndex) => {
        for (let objectIndex = 0; objectIndex < objectArray.length; objectIndex++) {
            if (limit && numberOfFound >= limit) {
                break
            }
            const isHit = objectArray[objectIndex].flattened.find(flattenedItem => comparisonFunction(searchString, flattenedItem.value))
            if (isHit) {
                hits[strategyIndex].push({
                    item: objectArray.splice(objectIndex, 1)[0].original,
                    path: isHit.path,
                    depth: isHit.depth
                })
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