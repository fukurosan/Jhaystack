import Engine from "./Engine"
const s_Engine = Symbol()

export default class Jhaystack {

  constructor(options) {
    this[s_Engine] = new Engine(options)
  }

  setComparisonStrategy(strategy) {
    this[s_Engine].setComparisonStrategy(strategy)
    return this
  }

  setTraversalStrategy(strategy) {
    this[s_Engine].setTraversalStrategy(strategy)
    return this
  }

  setSortingStrategy(strategy) {
    this[s_Engine].setSortingStrategy(strategy)
    return this
  }

  setExcludedPaths(paths) {
    this[s_Engine].setExcludedPaths(paths)
    return this
  }

  setIncludedPaths(paths) {
    this[s_Engine].setIncludedPaths(paths)
    return this
  }

  setDataset(datasetArray) {
    this[s_Engine].setDataset(datasetArray)
    return this
  }

  setIndexStrategy(indexes) {
    this[s_Engine].setIndexStrategy(indexes)
    return this
  }

  setLimit(limit) {
    this[s_Engine].setLimit(limit)
    return this
  }

  search(searchString) {
    return this[s_Engine].search(searchString)
  }

  indexLookup(searchString) {
    return this[s_Engine].indexLookup(searchString)
  }

}