export default (term: string, context: any): boolean => {
    return (`${context}`).endsWith(`${term}`)
}