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

  setIgnoredAttributes(attributes) {
    this[s_Engine].setIgnoredAttributes(attributes)
    return this
  }

  setIncludedAttributes(attributes) {
    this[s_Engine].setIncludedAttributes(attributes)
    return this
  }

  setDataset(datasetArray) {
    this[s_Engine].setDataset(datasetArray)
    return this
  }

  search(searchString) {
    return this[s_Engine].search(searchString)
  }

}