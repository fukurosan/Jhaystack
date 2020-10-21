import { ObjectLiteral } from "../Utility/JsonUtility"

//This bitap version will scan the entire context string to ensure the absolute best hit is always captured.

const generateBitMask = (term: string, context: string) => {
    let characterMap: ObjectLiteral = {}
    context.split("").forEach(contextCharacter => {
        characterMap[contextCharacter] = 0
    })
    for (let i = 0; i < term.length; i++) {
        characterMap[term.charAt(i)] = (characterMap[term.charAt(i)] || 0) | (1 << i)
    }
    return characterMap
}

const getTweenedRelevance = (distance: number, matchKDepth: number) => {
    //K value always takes precendce in score. Secondarily relevance is based on absolute vicinity to context index 0
    matchKDepth++
    distance < 0 && (distance = 0)
    const lowestPossibleScore = 1 / (matchKDepth + 1)
    const highestPossibleScore = 1 / matchKDepth
    const distanceMultiplier = 1 / (distance + 1)
    const tweenedRelevance = lowestPossibleScore + (distanceMultiplier * (highestPossibleScore * lowestPossibleScore))
    return tweenedRelevance === highestPossibleScore ? tweenedRelevance - 0.00000001 : tweenedRelevance === lowestPossibleScore ? tweenedRelevance + 0.00000001 : tweenedRelevance
}

export default (termIn: string, contextIn: string, maxErrors: number = 2): number => {
    const term = `${termIn}`.toUpperCase()
    const context = `${contextIn}`.toUpperCase()
    const contextLength = context.length
    const termLength = term.length
    if (termLength - maxErrors > contextLength) {
        return 0
    }
    const numberOfStates = maxErrors + 1 //+1 is the 0 state (no errors!)
    const bitMask = generateBitMask(term, context)
    const finish = 1 << termLength - 1

    if (maxErrors === 0) {
        //This basically becomes a contains search, which is much faster
        let r = 0
        for (let i = 0; i < contextLength; i++) {
            r = (r << 1 | 1) & bitMask[context.charAt(i)]
            if ((r & finish) === finish) {
                return getTweenedRelevance(i - (termLength - 1), 0)
            }
        }
        return 0
    }

    //Search
    let state = new Array(numberOfStates).map(() => 0)
    let tempMatchKDepth = null
    let tempMatchDistance = null
    let matchKDepth = null
    let matchDistance = null
    search:
    for (let i = 0; i < contextLength; i++) {
        let rStringMask = 0
        for (let j = 0; j < state.length; j++) {
            //Sacrificing a bit of readbility in the name of performance
            let nextRString = state[j]              //Handle Insertion
            state[j] = (state[j] << 1 | 1)
            nextRString |= state[j]                 //Handle Replacement
            state[j] &= bitMask[context.charAt(i)]
            state[j] |= rStringMask
            nextRString |= state[j] << 1 | 1
            rStringMask = nextRString               //Handle Removal
        }
        if (tempMatchKDepth !== null) {
            tempMatchKDepth--
            let found = false
            if ((state[tempMatchKDepth] & finish) !== finish || tempMatchKDepth === -1) {
                //Last cycle was the best match
                tempMatchKDepth++
                found = true
            }
            else if (i === context.length - 1) {
                found = true
            }
            if (found) {
                if (matchKDepth === null || matchKDepth > tempMatchKDepth) {
                    matchKDepth = tempMatchKDepth
                    matchDistance = tempMatchDistance
                    if (matchKDepth === 0) {
                        break search
                    }
                }
                tempMatchKDepth = null
            }
        }
        else if ((state[maxErrors] & finish) === finish) {
            tempMatchKDepth = maxErrors
            tempMatchDistance = i - (termLength - 1) - tempMatchKDepth
            if (matchKDepth === null && matchDistance === null) {
                matchKDepth = maxErrors
                matchDistance = i - (termLength - 1) - tempMatchKDepth
            }
        }
    }

    if (matchKDepth !== null && matchDistance !== null) {
        if (matchKDepth === 0) {
            return getTweenedRelevance(matchDistance, matchKDepth)
        }
        return getTweenedRelevance(matchDistance, matchKDepth)
    }

    return 0
}