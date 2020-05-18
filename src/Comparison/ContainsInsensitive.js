export default (term, context) => {
    return (`${context}`).toUpperCase().indexOf((`${term}`).toUpperCase()) > -1
}