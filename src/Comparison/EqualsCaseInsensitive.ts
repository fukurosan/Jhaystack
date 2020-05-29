export default (term: string, context: any): number => {
    return (`${context}`).toUpperCase() === (`${term}`).toUpperCase() ? 1 : 0
}