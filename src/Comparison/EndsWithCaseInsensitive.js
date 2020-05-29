export default (term, context) => {
    return (`${context}`).toUpperCase().endsWith((`${term}`).toUpperCase()) ? 1 : 0
}