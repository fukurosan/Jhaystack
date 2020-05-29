export default (term: string, context: any): number => {
    return (`${context}`).startsWith(`${term}`) ? 1 : 0
}