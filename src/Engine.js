import { FUZZY } from "./Strategies/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_MATCH } from "./Strategies/TraversalStrategy"
import { attributeValidator } from "./Validation/Validation"
import { deepCopyObject } from "./Utility/JsonUtility"

export default class SearchEngine {

  constructor() {
    this.comparisonStrategy = [FUZZY]
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_MATCH
    this.data = []
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
  }

  setIncludedAttributes(attributes) {
    if (!attributes) {
      this.includedAttributes = null
    }
    else {
      this.includedAttributes = {}
      attributes.forEach(attr => this.includedAttributes[attr] = true)
    }
    return this
  }

  setDataset(datasetArray) {
    this.data = deepCopyObject(datasetArray)
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

  search(searchString) {
    if (!this.data) {
      throw Error("No Dataset provided!")
    }
    const validator = this.getValidator()
    return this.traversalStrategy(this.data, searchString, this.comparisonStrategy, validator, this.limit)
  }

}