import { FUZZY } from "./Comparison/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH } from "./Traversal/TraversalStrategy"
import { SORT_BY_VALUE } from "./Sorting/SortingStrategy"
import { deepCopyObject } from "./Utility/JsonUtility"
import Item from "./Model/Item"
import Index from "./Model/Index"
import SearchResult from "./Model/SearchResult"

export default class SearchEngine {
  private comparisonStrategy: ((term: any, context: any) => boolean)[]
  private traversalStrategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]
  private sortingStrategy: (a: SearchResult, b: SearchResult) => number
  private items: Item[]
  private originalData: object[]
  private indexes: Index[]
  private limit: number|null
  private excludedPaths: (RegExp|string)[]|null
  private includedPaths: (RegExp|string)[]|null

  constructor() {
    this.comparisonStrategy = [FUZZY]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH
    this.sortingStrategy = SORT_BY_VALUE
    this.items = []
    this.originalData = []
    this.indexes = []
    this.limit = null
    this.excludedPaths = null
    this.includedPaths = null
  }

  setComparisonStrategy(strategy: ((term: any, context: any) => boolean)[]) {
    if (!Array.isArray(strategy)) {
      this.comparisonStrategy = [strategy]
    }
    else {
      this.comparisonStrategy = strategy
    }
  }

  setTraversalStrategy(strategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]) {
    this.traversalStrategy = strategy
  }

  setSortingStrategy(strategy: (a: SearchResult, b: SearchResult) => number) {
    this.sortingStrategy = strategy
  }

  setExcludedPaths(paths: string[]) {
    if (!paths || !Array.isArray(paths)) {
      this.excludedPaths = null
    }
    else {
      this.excludedPaths = paths
    }
    this.prepareDataset()
  }

  setIncludedPaths(paths: string[]) {
    if (!paths || !Array.isArray(paths)) {
      this.includedPaths = null
    }
    else {
      this.includedPaths = paths
    }
    this.prepareDataset()
  }

  setDataset(datasetArray: object[]) {
    this.originalData = deepCopyObject(datasetArray)
    this.prepareDataset()
  }

  setLimit(limit: number) {
    this.limit = limit
  }

  setIndexes(indexes: Index[]) {
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

  search(searchString: string) {
    return this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit).sort(this.sortingStrategy)
  }

}