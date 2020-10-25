/**
 * Checks if all term characters exists within the context in their given sequence. (not case sensitive!)
 * Score is secondarily based on the total space bewteen the characters.
 * @param {any} term - The term to be matched
 * @param {any} context - The context to searched
 * @return {number} - Resulting score
 */
export default (termIn: any, contextIn: any): number => {
    const term = (`${termIn}`).toUpperCase().replace(/ /g, "")
    const context = (`${contextIn}`).toUpperCase().replace(/ /g, "")
    const termLength = term.length
    const contextLength = context.length
    let distance = 0
    let counting = false
    if (termLength > contextLength) {
        return 0
    }
    outer: for (let i = 0, j = 0; i < termLength; i++) {
        let termCharacter = term.charAt(i)
        while (j < contextLength) {
            if (context.charAt(j++) === termCharacter) {
                counting = true
                continue outer
            }
            if (counting) {
                distance++
            }
        }
        return 0
    }
    return 1 / (distance + 1)
}