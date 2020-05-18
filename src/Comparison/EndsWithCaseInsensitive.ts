export default (term: string, context: any): boolean => {
    return (`${context}`).toUpperCase().endsWith((`${term}`).toUpperCase())
}