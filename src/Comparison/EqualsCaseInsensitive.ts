export default (term: string, context: any): boolean => {
    return (`${context}`).toUpperCase() === (`${term}`).toUpperCase()
}