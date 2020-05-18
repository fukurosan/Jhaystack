export default (term: string, context: any): boolean => {
    return (`${context}`).toUpperCase().startsWith((`${term}`).toUpperCase())
}