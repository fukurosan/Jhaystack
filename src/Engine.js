import { FUZZY } from "./Strategies/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH } from "./Strategies/TraversalStrategy"
import { attributeValidator } from "./Validation/Validation"
import { deepCopyObject, flattenObject } from "./Utility/JsonUtility"

export default class SearchEngine {

  constructor() {
    this.comparisonStrategy = [FUZZY]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH
    this.originalData = []
    this.processedData = []
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

  getValidator() {
    return (attribute) => {
      return attributeValidator(attribute, this.includedAttributes, this.ignoredAttributes)
    }
  }

  prepareDataset() {
    const validator = this.getValidator()
    this.processedData = this.originalData
      .map(object => {
        return {
          original: object,
          flattened: flattenObject(object)
        }
      })
      .filter(object => validator(object.flattened.path))
  }

  search(searchString) {
    if (!this.processedData) {
      throw Error("No Dataset provided!")
    }
    return this.traversalStrategy(this.processedData, searchString, this.comparisonStrategy, this.limit)
  }

}