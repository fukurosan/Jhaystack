import { FUZZY } from "./Strategies/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH } from "./Strategies/TraversalStrategy"
import { deepCopyObject, flattenObject } from "./Utility/JsonUtility"
import Item from "./Model/Item"

export default class SearchEngine {

  constructor() {
    this.comparisonStrategy = [FUZZY]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH
    this.items = [] //Item
    this.originalData = []
    this.limit = null
    this.excludedPaths = null
    this.includedPaths = null
  }

  setComparisonStrategy(strategy) {
    if (!Array.isArray(strategy)) {
      this.comparisonStrategy = [strategy]
    }
    else {
      this.comparisonStrategy = strategy
    }
    return this
  }

  setTraversalStrategy(strategy) {
    this.traversalStrategy = strategy
    return this
  }

  setExcludedPaths(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.excludedPaths = null
    }
    else {
      this.excludedPaths = paths
      return this
    }
    this.prepareDataset()
  }

  setIncludedAttributes(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.includedPaths = null
    }
    else {
      this.includedPaths = paths
    }
    this.prepareDataset()
    return this
  }

  setDataset(datasetArray) {
    this.originalData = deepCopyObject(datasetArray)
    this.prepareDataset()
    return this
  }

  setLimit(limit) {
    this.limit = limit
    return this
  }

  prepareDataset() {
      this.items = this.originalData.map(item => {
        return new Item(item, this.includedPaths, this.excludedPaths)
      })
  }

  search(searchString) {
    return this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit)
  }

}