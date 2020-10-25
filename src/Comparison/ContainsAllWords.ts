/**
 * Checks if all words in the term exist within the context.
 * @param {any} term - The term to be matched
 * @param {any} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: any, context: any): number => {
    let found = 0
    const termWords = (`${term}`).toUpperCase().split(" ")
    const contextWords = (`${context}`).toUpperCase().split(" ")
    termWords.forEach(termWord => {
        if(contextWords.indexOf(termWord) > -1) {
            found++
        }
    })
    return found === termWords.length ? 1 : 0
}