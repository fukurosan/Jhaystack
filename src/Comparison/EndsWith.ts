export default (term: string, context: any): number => {
    return (`${context}`).endsWith(`${term}`) ? 1 : 0
}