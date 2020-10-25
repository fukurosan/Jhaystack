/**
 * Checks if the context ends with the term (case sensitive!).
 * @param {any} term - The term to be matched
 * @param {any} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: any, context: any): number => {
    return (`${context}`).endsWith(`${term}`) ? 1 : 0
}