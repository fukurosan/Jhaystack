import { FUZZY } from "./Strategies/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH } from "./Strategies/TraversalStrategy"
import { deepCopyObject } from "./Utility/JsonUtility"
import Item from "./Model/Item"
import Index from "./Model/Index"

export default class SearchEngine {
  private comparisonStrategy: ((term: any, context: any) => boolean)[]
  private traversalStrategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]
  private items: Item[]
  private originalData: Object[]
  private indexes: Index[]
  private limit: Number|null
  private excludedPaths: String[]|null
  private includedPaths: String[]|null

  constructor() {
    this.comparisonStrategy = [FUZZY]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH
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

  setExcludedPaths(paths: String[]) {
    if (!paths || !Array.isArray(paths)) {
      this.excludedPaths = null
    }
    else {
      this.excludedPaths = paths
    }
    this.prepareDataset()
  }

  setIncludedAttributes(paths: String[]) {
    if (!paths || !Array.isArray(paths)) {
      this.includedPaths = null
    }
    else {
      this.includedPaths = paths
    }
    this.prepareDataset()
  }

  setDataset(datasetArray: Object[]) {
    this.originalData = deepCopyObject(datasetArray)
    this.prepareDataset()
  }

  setLimit(limit: Number) {
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

  search(searchString: String) {
    return this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit)
  }

}