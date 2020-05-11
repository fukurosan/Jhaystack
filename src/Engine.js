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
    this.ignoredAttributes = this.ignoredAttributes
    return this
  }

  setIncludedAttributes(attributes) {
    this.includedAttributes = attributes
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