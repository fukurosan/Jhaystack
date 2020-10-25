/**
 * Checks if the context is equal to the term (case sensitive!).
 * @param {any} term - The term to be matched
 * @param {any} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: any, context: any): number => {
    return (`${context}`) === (`${term}`) ? 1 : 0
}