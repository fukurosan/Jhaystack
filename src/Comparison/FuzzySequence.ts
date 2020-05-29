export default (termIn: string, contextIn: any): number => {
    const term = (`${termIn}`).toUpperCase().replace(/ /g, "")
    const context = (`${contextIn}`).toUpperCase().replace(/ /g, "")
    const termLength = term.length
    const contextLength = context.length
    let distance = 0
    let counting = false
    if (termLength > contextLength) {
        return 0
    }
    outer: for (let i = 0, j = 0; i < termLength; i++) {
        let termCharacter = term.charAt(i)
        while (j < contextLength) {
            if (context.charAt(j++) === termCharacter) {
                counting = true
                continue outer
            }
            if (counting) {
                distance++
            }
        }
        return 0
    }
    return 1 / (distance + 1)
}