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
    this.ignoredAttributes = null
    this.includedAttributes = null
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

  setIgnoredAttributes(attributes) {
    if (!attributes) {
      this.ignoredAttributes = null
    }
    else {
      this.ignoredAttributes = {}
      attributes.forEach(attr => this.ignoredAttributes[attr] = true)
      return this
    }
    this.prepareDataset()
  }

  setIncludedAttributes(attributes) {
    if (!attributes) {
      this.includedAttributes = null
    }
    else {
      this.includedAttributes = {}
      attributes.forEach(attr => this.includedAttributes[attr] = true)
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
        return new Item(item, this.includedAttributes, this.ignoredAttributes)
      })
  }

  search(searchString) {
    return this.traversalStrategy(this.items, searchString, this.comparisonStrategy, this.limit)
  }

}