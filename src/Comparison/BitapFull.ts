import { ObjectLiteral } from "../Utility/JsonUtility"
import { getTweenedRelevance } from "../Utility/Mathematics"

/**
 * Creates a bit mask of the context based on the position of characters found in the term.
 * @param {string} term - The term to be matched
 * @param {string} context - The context to search
 * @return {object} - A bit mask map where the keys are the characters in the term.
 */
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

/**
 * Finds the best match of the term contained in the context that is within the given levenshtein distance.
 * @param {any} termIn - The term to be matched
 * @param {any} contextIn - The context to search
 * @param {number} maxErrors - Maximum levenshtein distance (integer)
 * @param {boolean} isPositionRelevant - If true relevance will secondarily be based on term's absolute vicinity to index 0 in context
 * @return {number} - Resulting score. Score is primarily based on the levenshtein distance.
 */
export default (termIn: any, contextIn: any, maxErrors: number = 2, isPositionRelevant: boolean = true): number => {
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
                return isPositionRelevant ? getTweenedRelevance(0, i - (termLength - 1)) : 1
            }
        }
        return 0
    }

    //Search
    let state = new Array(numberOfStates).fill(0)
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
            return isPositionRelevant ? getTweenedRelevance(matchKDepth, matchDistance) : 1 / (matchKDepth + 1)
        }
        return isPositionRelevant ? getTweenedRelevance(matchKDepth, matchDistance) : 1 / (matchKDepth + 1)
    }

    return 0
}