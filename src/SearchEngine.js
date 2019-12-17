export default class SearchEngine {

  constructor(searchAttributes, discludedAttributes) {
    this.searchAttributes = searchAttributes
    this.discludedAttributes = discludedAttributes
  }

  search(dataArr, searchString) {
    let data = this.copyObject(dataArr)
    let fuzzyHits = []
    let strictHits = []
    data.forEach(item => {
      this.traverseItem(item, searchString, false, true)
        ? strictHits.push(item)
        : this.traverseItem(item, searchString, false, false) && fuzzyHits.push(item)
    })
    let results = {
      strict: strictHits,
      fuzzy: fuzzyHits
    }
    return results
  }

  traverseItem(object, searchString, isHit, strict) {
    if (this.searchForStringValue(object, searchString, strict)) {
      isHit = true
    }
    else {
      Object.keys(object).forEach(key => {
        if (this.shouldEvaluateKey(key)) {
          if (object[key] === Object(object[key])) {
            isHit = this.traverseItem(object[key], searchString, isHit, strict)
          }
        }
      })
    }
    return isHit
  }

  searchForStringValue(item, searchString, strict) {
    let isHit = false
    Object.keys(item).forEach(key => {
      if (this.shouldEvaluateKey(key)) {
        const thisItem = item[key]
        if (thisItem !== null && typeof thisItem !== "object") {
          if (!isHit) {
            isHit = strict
              ? this.strictSearch(searchString, thisItem)
              : this.fuzzysearch(searchString, thisItem)
          }
        }
      }
    })
    return isHit
  }

  strictSearch(query, target) {
    return target.toLowerCase().startsWith(query.toLowerCase())
  }

  fuzzysearch(term, context) {
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

  copyObject(o) {
    var out, v, key
    out = Array.isArray(o) ? [] : {}
    for (key in o) {
      v = o[key]
      out[key] = typeof v === "object" && v !== null ? this.copyObject(v) : v
    }
    return out
  }

  shouldEvaluateKey(key, included, discluded) {
    if (included && included.indexOf(key) > -1) {
      return true
    }
    else if (included && included.indexOf(key) === -1) {
      return false
    }
    else if (discluded && discluded.indexOf(key) === -1) {
      return true
    }
    else if (discluded && discluded.indexOf(key) > -1) {
      return false
    }
    else {
      return true
    }
  }

  extractNestedObjects(object, key, value) {
    let foundArr = []
    const seen = new WeakSet()
    JSON.stringify(object, (currKey, nestedValue) => {
      if(typeof nestedValue === "object" && nestedValue !== null){
        if(seen.has(nestedValue)){
          return
        }
        seen.add(nestedValue)
      }
      if(nestedValue && nestedValue[key] === value) {
        foundArr.push(nestedValue)
      }
      return nestedValue
    })
    return foundArr
  }

}