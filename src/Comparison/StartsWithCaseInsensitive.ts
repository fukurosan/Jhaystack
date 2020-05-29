export default (term: string, context: any): number => {
    return (`${context}`).toUpperCase().startsWith((`${term}`).toUpperCase()) ? 1 : 0
}