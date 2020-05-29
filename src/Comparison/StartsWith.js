export default (term, context) => {
    return (`${context}`).startsWith(`${term}`) ? 1 : 0
}