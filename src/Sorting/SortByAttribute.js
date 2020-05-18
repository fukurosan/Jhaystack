export default (a, b) => {
    if (a.path[a.path.length - 1] < b.path[b.path.length - 1]) return -1
    if (a.path[a.path.length - 1] > b.path[b.path.length - 1]) return 1
    return 0
}