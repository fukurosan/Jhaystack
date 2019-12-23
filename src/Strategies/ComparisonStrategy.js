export const FUZZY_SEARCH = (term, context) => {
    term = term.toLowerCase().replace(/ /g, "")
    context = context.toLowerCase().replace(/ /g, "")
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

export const STARTS_WITH = (term, context) => {
    return context.toLowerCase().startsWith(term.toLowerCase())
}

export const CONTAINS = (term, context) => {
    return context.toLowerCase().indexOf(term.toLowerCase()) > -1
}

export const EXACT_MATCH = (term, context) => {
    return context === term
}

export default {
    FUZZY_SEARCH,
    STARTS_WITH,
    CONTAINS,
    EXACT_MATCH
}