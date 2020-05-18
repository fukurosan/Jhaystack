export default (term: string, context: any): boolean => {
    return (`${context}`).indexOf(`${term}`) > -1
}