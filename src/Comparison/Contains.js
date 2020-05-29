export default (term, context) => {
    return (`${context}`).indexOf(`${term}`) > -1 ? 1 : 0
}