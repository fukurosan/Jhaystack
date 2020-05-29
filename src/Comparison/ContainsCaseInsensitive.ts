export default (term: string, context: any): number => {
    return (`${context}`).toUpperCase().indexOf((`${term}`).toUpperCase()) > -1 ? 1 : 0
}