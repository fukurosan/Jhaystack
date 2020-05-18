import Engine from "./Engine"
import Index from "./Model/Index"
import SearchResult from "./Model/SearchResult"

export default class Jhaystack {

  private engine: Engine

  constructor() {
    this.engine = new Engine()
  }

  setComparisonStrategy(strategy: ((term: string, context: any) => boolean)[]) {
    this.engine.setComparisonStrategy(strategy)
    return this
  }

  setTraversalStrategy(strategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]) {
    this.engine.setTraversalStrategy(strategy)
    return this
  }

  setSortingStrategy(strategy: (a: SearchResult, b: SearchResult) => number) {
    this.engine.setSortingStrategy(strategy)
    return this
  }

  setExcludedPaths(paths: string[]) {
    this.engine.setExcludedPaths(paths)
    return this
  }

  setIncludedPaths(paths: string[]) {
    this.engine.setIncludedPaths(paths)
    return this
  }

  setDataset(datasetArray: object[]) {
    this.engine.setDataset(datasetArray)
    return this
  }

  setIndexes(indexes: Index[]) {
    this.engine.setIndexes(indexes)
    return this
  }

  setLimit(limit: number) {
    this.engine.setLimit(limit)
    return this
  }

  search(searchString: string) {
    return this.engine.search(searchString)
  }

}