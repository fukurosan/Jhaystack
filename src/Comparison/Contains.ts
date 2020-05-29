export default (term: string, context: any): number => {
    return (`${context}`).indexOf(`${term}`) > -1 ? 1 : 0
}