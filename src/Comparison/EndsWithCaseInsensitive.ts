export default (term: string, context: any): number => {
    return (`${context}`).toUpperCase().endsWith((`${term}`).toUpperCase()) ? 1 : 0
}