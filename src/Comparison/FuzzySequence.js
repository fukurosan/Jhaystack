export default (term, context) => {
    term = (`${term}`).toUpperCase().replace(/ /g, "")
    context = (`${context}`).toUpperCase().replace(/ /g, "")
    const contextLength = context.length
    const termLength = term.length
    if (termLength > contextLength) {
        return false
    }
    if (termLength === contextLength) {
        return term === context
    }
    if (context.indexOf(term) !== -1) {
        return true
    }
    outer: for (let i = 0, j = 0; i < termLength; i++) {
        let termCharacter = term.charAt(i)
        while (j < contextLength) {
            if (context.charAt(j++) === termCharacter) {
                continue outer
            }
        }
        return false
    }
    return true
}