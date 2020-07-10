import { ObjectLiteral } from "../Utility/JsonUtility"

//Fantastic Japanese wiki article on Bitap (shift-and, shift-or): 
//https://ja.m.wikipedia.org/wiki/Bitapアルゴリズム
//The implementation in this file includes Wu & Mander's changes:
//https://dl.acm.org/doi/pdf/10.1145/135239.135244
//Navarro's implementation for reference: 
//https://www.researchgate.net/publication/2437209_A_Faster_Algorithm_for_Approximate_String_Matching
//Myer's implementation for reference:
//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.332.9395&rep=rep1&type=pdf
//This implementation does not include Navarro's changes.
//The default maximum Levenshtein distance of this implementation is 2

const generateBitMask = (term: string, context: string) => {
    let characterMap: ObjectLiteral = {}
    context.split("").forEach(contextCharacter => {
        characterMap[contextCharacter] = 0
    })
    for (let i = 0; i < term.length; i++) {
        const termCharacter = term.charAt(i)
        characterMap[termCharacter] = (characterMap[termCharacter] || 0) | (1 << i)
    }
    return characterMap
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

    //First doing an exact search will in many cases speed things up
    let r = 0
    for (let i = 0; i < contextLength; i++) {
        r = (r << 1 | 1) & bitMask[context.charAt(i)]
        if ((r & finish) === finish) {
            return 1
        }
    }

    //Fuzzy search
    let state = [...new Array(numberOfStates)].map(() => 0)
    let matchKDepth = null
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
        if(matchKDepth) {
            matchKDepth--
            if ((state[matchKDepth] & finish) !== finish) {
                //Last cycle was the best match
                matchKDepth++
                //K value always takes precendce in score. Secondarily relevance is based on vicinity to context index 0
                let distance = i - termLength - matchKDepth
                distance < 0 && (distance = 0)
                const kMultiplier = 1 / (matchKDepth + 1)
                const lowerKMultiplier = 1 / (matchKDepth)
                const tweenedRelevance = kMultiplier + ((distance / contextLength) * (lowerKMultiplier * kMultiplier))
                return tweenedRelevance
            }
        }
        else if ((state[maxErrors] & finish) === finish) {
            matchKDepth = maxErrors
        }
    }

    return 0
}