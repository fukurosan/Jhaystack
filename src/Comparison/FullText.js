export default (term, context) => {
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