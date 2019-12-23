import { FUZZY_SEARCH } from "./Strategies/ComparisonStrategy"
import { RETURN_ROOT_ON_FIRST_FOUND } from "./Strategies/TraversalStrategy"
import { attributeValidator } from "./Validation/Validation"
import { deepCopyObject } from "./Utility/JsonUtility"

export default class SearchEngine {

  constructor() {
    this.comparisonStrategy = FUZZY_SEARCH
    this.traversalStrategy = RETURN_ROOT_ON_FIRST_FOUND
    this.data = []
  }

  setComparisonStrategy(strategy) {
    this.comparisonStrategy = strategy
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

  getValidator() {
    return (attribute) => {
      return attributeValidator(attribute, this.includedAttributes, this.ignoredAttributes)
    }
  }

  search(searchString) {
    if (!this.data) {
      return "NO DATASET"
    }
    const validator = this.getValidator()
    return this.traversalStrategy(this.data, searchString, this.comparisonStrategy, validator)
  }

}