export default (term, context) => {
    return (`${context}`).toUpperCase() === (`${term}`).toUpperCase() ? 1 : 0
}