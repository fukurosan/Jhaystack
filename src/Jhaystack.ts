import Engine from "./Engine"
import { IIndex } from "./Model/Index"
import SearchResult from "./Model/SearchResult"
import IOptions from "./Options"

export default class Jhaystack {

  private engine: Engine

  constructor(options?: IOptions) {
    this.engine = new Engine(options)
  }

  setComparisonStrategy(strategy: ((term: string, context: any) => number)[]) {
    this.engine.setComparisonStrategy(strategy)
    return this
  }

  setTraversalStrategy(strategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]) {
    this.engine.setTraversalStrategy(strategy)
    return this
  }

  setSortingStrategy(strategy: ((a: SearchResult, b: SearchResult) => number)[]) {
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

  setIndexStrategy(indexes: IIndex[]) {
    this.engine.setIndexStrategy(indexes)
    return this
  }

  setLimit(limit: number) {
    this.engine.setLimit(limit)
    return this
  }

  search(searchString: string) {
    return this.engine.search(searchString)
  }

  indexLookup(searchString: string) {
    return this.engine.indexLookup(searchString)
  }

}