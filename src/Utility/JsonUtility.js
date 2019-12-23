export const deepCopyObject = (o) => {
    let out = Array.isArray(o) ? [] : {}
    for (let key in o) {
        let v = o[key]
        out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
    }
    return out
}