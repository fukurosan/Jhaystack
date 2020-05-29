import { BITAP } from "./Comparison/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH_ORDERED } from "./Traversal/TraversalStrategy"
import { deepCopyObject, mergeArraySortFunctions } from "./Utility/JsonUtility"
import Item from "./Model/Item"

export default class SearchEngine {

  constructor() {
    this.comparisonStrategy = [BITAP]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH_ORDERED
    this.sortingStrategy = []
    this.items = []
    this.originalData = []
    this.indexes = []
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
  }

  setTraversalStrategy(strategy) {
    this.traversalStrategy = strategy
  }

  setSortingStrategy(strategy) {
    if(!Array.isArray(strategy)) {
      this.sortingStrategy = [strategy]
    }
    else {
      this.sortingStrategy = strategy
    }
  }

  setExcludedPaths(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.excludedPaths = null
    }
    else {
      this.excludedPaths = paths
    }
    this.prepareDataset()
  }

  setIncludedPaths(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.includedPaths = null
    }
    else {
      this.includedPaths = paths
    }
    this.prepareDataset()
  }

  setDataset(datasetArray) {
    this.originalData = deepCopyObject(datasetArray)
    this.prepareDataset()
  }

  setLimit(limit) {
    this.limit = limit
  }

  setIndexes(indexes) {
    if (!indexes || !Array.isArray(indexes)) {
      this.indexes = []
    }
    else {
      this.indexes = indexes
    }
    this.prepareDataset()
  }

  prepareDataset() {
    delete this.items
    this.items = this.originalData.map(item => {
      return new Item(item, this.includedPaths, this.excludedPaths, this.indexes)
    })
  }

  search(searchString) {
    let searchResult = this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit)
    if(this.sortingStrategy.length > 0) {
      searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
    }
    return searchResult
  }

}