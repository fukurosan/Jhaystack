export default (a, b) => {
    if (a.relevance < b.relevance) return 1
    if (a.relevance > b.relevance) return -1
    return 0
}