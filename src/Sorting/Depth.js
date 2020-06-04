export default (a, b) => {
    if (a.depth < b.depth) return -1
    if (a.depth > b.depth) return 1
    return 0
}