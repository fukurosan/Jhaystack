export const EXTRACT_ALL_NESTED = (itemArray, searchString, comparisonStrategy, limit) => {
    let result = []
    let numberOfFound = 0
    itemArray.forEach(item => {
        if (limit && numberOfFound >= limit) {
            return
        }
        item.shards.filter(shard => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, shard.value)))
            .forEach(shard => {
                if (limit && numberOfFound >= limit) {
                    return
                }
                result.push({
                    item: shard.path.slice(0, shard.path.length - 1).reduce((acc, current) => { return acc[current] }, item.original),
                    path: shard.path[shard.path.length - 1],
                    depth: 1
                })
            })
        numberOfFound++
    })
    return result
}

export const RETURN_ROOT_ON_FIRST_MATCH = (itemArray, searchString, comparisonStrategy, limit) => {
    let result = []
    let numberOfFound = 0
    itemArray.forEach(item => {
        if (limit && numberOfFound >= limit) {
            return
        }
        const foundShard = item.shards.find(shard => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, shard.value)))
        if (foundShard) {
            result.push({
                item: item.original,
                path: foundShard.path,
                depth: foundShard.depth
            })
            numberOfFound++
        }
    })
    return result
}

export const RETURN_ROOT_ON_FIRST_MATCH_ORDERED = (itemArrayIn, searchString, comparisonStrategy, limit) => {
    const itemArray = [...itemArrayIn]
    let matches = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => matches.push([]))

    comparisonStrategy.forEach((comparisonFunction, strategyIndex) => {
        for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
            if (limit && numberOfFound >= limit) {
                break
            }
            const foundShard = itemArray[itemIndex].shards.find(shard => comparisonFunction(searchString, shard.value))
            if (foundShard) {
                matches[strategyIndex].push({
                    item: itemArray.splice(itemIndex, 1)[0].original,
                    path: foundShard.path,
                    depth: foundShard.depth
                })
                numberOfFound++
                itemIndex--
            }
        }
    })

    let result = []
    matches.forEach(hitArray => {
        result = [...result, ...hitArray]
    })

    return result
}

export default {
    EXTRACT_ALL_NESTED,
    RETURN_ROOT_ON_FIRST_MATCH,
    RETURN_ROOT_ON_FIRST_MATCH_ORDERED
}