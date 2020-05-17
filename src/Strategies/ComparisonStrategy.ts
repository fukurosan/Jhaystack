export const FUZZY = (term: string, context: any) => {
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

export const STARTS_WITH = (term: string, context: any) => {
    return (`${context}`).startsWith(`${term}`)
}

export const STARTS_WITH_CASE_INSENSITIVE = (term: string, context: any) => {
    return (`${context}`).toUpperCase().startsWith((`${term}`).toUpperCase())
}

export const ENDS_WITH = (term: string, context: any) => {
    return (`${context}`).endsWith(`${term}`)
}

export const ENDS_WITH_CASE_INSENSITIVE = (term: string, context: any) => {
    return (`${context}`).toUpperCase().endsWith((`${term}`).toUpperCase())
}

export const CONTAINS = (term: string, context: any) => {
    return (`${context}`).indexOf(`${term}`) > -1
}

export const CONTAINS_CASE_INSENSITIVE = (term: string, context: any) => {
    return (`${context}`).toUpperCase().indexOf((`${term}`).toUpperCase()) > -1
}

export const EQUALS = (term: string, context: any) => {
    return (`${context}`) === (`${term}`)
}

export const EQUALS_CASE_INSENSITIVE = (term: string, context: any) => {
    return (`${context}`).toUpperCase() === (`${term}`).toUpperCase()
}

export const FULL_TEXT = (term: string, context: any) => {
    let found = 0
    const termWords = (`${term}`).toUpperCase().split(" ")
    const contextWords = (`${context}`).toUpperCase().split(" ")
    termWords.forEach(termWord => {
        if(contextWords.indexOf(termWord) > -1) {
            found++
        }
    })
    return found === termWords.length
}

export default {
    FUZZY,
    STARTS_WITH,
    STARTS_WITH_CASE_INSENSITIVE,
    ENDS_WITH,
    ENDS_WITH_CASE_INSENSITIVE,
    CONTAINS,
    CONTAINS_CASE_INSENSITIVE,
    EQUALS,
    EQUALS_CASE_INSENSITIVE,
    FULL_TEXT
}