export default (term: string, context: any): boolean => {
    return (`${context}`).toUpperCase().indexOf((`${term}`).toUpperCase()) > -1
}