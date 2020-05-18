export default (term, context) => {
    return (`${context}`).toUpperCase().startsWith((`${term}`).toUpperCase())
}