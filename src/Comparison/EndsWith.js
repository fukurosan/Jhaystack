export default (term, context) => {
    return (`${context}`).endsWith(`${term}`) ? 1 : 0
}