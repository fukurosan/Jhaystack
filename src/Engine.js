import { BITAP } from "./Comparison/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH_ORDERED } from "./Traversal/TraversalStrategy"
import { deepCopyObject, mergeArraySortFunctions } from "./Utility/JsonUtility"
import Item from "./Model/Item"

export default class SearchEngine {

  constructor(options) {
    this.comparisonStrategy = [BITAP]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH_ORDERED
    this.indexStrategy = []
    this.sortingStrategy = []
    this.items = []
    this.originalData = []
    this.limit = null
    this.excludedPaths = []
    this.includedPaths = []

    if (options) {
      options.comparison && this.setComparisonStrategy(options.comparison)
      options.traversal && this.setTraversalStrategy(options.traversal)
      options.sorting && this.setSortingStrategy(options.sorting)
      options.limit && this.setLimit(options.limit)
      options.index && this.setIndexStrategy(options.index)
      options.includedPaths && this.setIncludedPaths(options.includedPaths)
      options.excludedPaths && this.setExcludedPaths(options.excludedPaths)
      options.data && this.setDataset(options.data)
    }
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
    if (!Array.isArray(strategy)) {
      this.sortingStrategy = [strategy]
    }
    else {
      this.sortingStrategy = strategy
    }
  }

  setExcludedPaths(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.excludedPaths = []
    }
    else {
      this.excludedPaths = paths
    }
    this.prepareDataset()
  }

  setIncludedPaths(paths) {
    if (!paths || !Array.isArray(paths)) {
      this.includedPaths = []
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

  setIndexStrategy(indexStrategy) {
    if (!indexStrategy || !Array.isArray(indexStrategy)) {
      this.indexStrategy = []
    }
    else {
      this.indexStrategy = indexStrategy
    }
    this.prepareDataset()
  }

  prepareDataset() {
    delete this.items
    this.items = this.originalData.map(item => {
      return new Item(item, this.includedPaths, this.excludedPaths, this.indexStrategy)
    })
  }

  search(searchString) {
    let searchResult = this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit)
    if (this.sortingStrategy.length > 0) {
      searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
    }
    return searchResult
  }

  indexLookup(searchString) {
    let result = this.items.reduce((acc, item) => {
      if (this.limit && acc.length >= this.limit) {
        return acc
      }
      const searchResult = item.indexLookup(searchString)
      if (searchResult) {
        acc.push(searchResult)
      }
      return acc
    }, [])
    if (this.sortingStrategy.length > 0) {
      result.sort(mergeArraySortFunctions(this.sortingStrategy))
    }
    return result
  }

}