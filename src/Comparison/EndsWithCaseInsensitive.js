export default (term, context) => {
    return (`${context}`).toUpperCase().endsWith((`${term}`).toUpperCase())
}