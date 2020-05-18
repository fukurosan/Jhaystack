export default (term: string, context: any): boolean => {
    term = (`${term}`).toUpperCase().replace(/ /g, "")
    context = (`${context}`).toUpperCase().replace(/ /g, "")
    const clen = context.length
    const tlen = term.length
    if (tlen > clen) {
        return false
    }
    if (tlen === clen) {
        return term === context
    }
    if (context.indexOf(term) !== -1) {
        return true
    }
    outer: for (let i = 0, j = 0; i < tlen; i++) {
        let nch = term.charCodeAt(i)
        while (j < clen) {
            if (context.charCodeAt(j++) === nch) {
                continue outer
            }
        }
        return false
    }
    return true
}