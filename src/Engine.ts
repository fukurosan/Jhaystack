import { BITAP } from "./Comparison/ComparisonStrategy"
import { FIND_VALUES } from "./Traversal/TraversalStrategy"
import { deepCopyObject, mergeArraySortFunctions } from "./Utility/JsonUtility"
import Item from "./Model/Item"
import SearchResult from "./Model/SearchResult"
import { IIndex } from "./Model/Index"
import RELEVANCE from "./Sorting/Relevance"
import IOptions from "./Options"
import ITraversal from "./Traversal/ITraversal"
import IComparison from "./Comparison/IComparison"

export default class SearchEngine {
	/** Array containing the comparison functions to be used for evaluating matches */
	private comparisonStrategy: IComparison[]
	/** The traversal strategy to use */
	private traversalStrategy: ITraversal
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	private sortingStrategy: ((a: SearchResult, b: SearchResult) => number)[]
	/** The processed dataset used for searching */
	private items: Item[]
	/** The original data set provided by the user */
	private originalData: any[]
	/** Types of indexes to be built for offline search */
	private indexStrategy: IIndex[]
	/** Maximum number of matches before search ends */
	private limit: number | null
	/** Explicit property paths to NOT evaluate during search. Excluded paths always take precedence over included paths */
	private excludedPaths: (RegExp | string)[]
	/** Explicit property paths to evaluate during search. Excluded paths always take precedence over included paths */
	private includedPaths: (RegExp | string)[]

	constructor(options?: IOptions) {
		this.comparisonStrategy = [BITAP]
		this.traversalStrategy = FIND_VALUES
		this.indexStrategy = []
		this.sortingStrategy = [RELEVANCE.DESCENDING]
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

	setComparisonStrategy(strategy: IComparison[]): void {
		if (!Array.isArray(strategy)) {
			this.comparisonStrategy = [strategy]
		} else {
			this.comparisonStrategy = strategy
		}
	}

	setTraversalStrategy(strategy: ITraversal): void {
		this.traversalStrategy = strategy
	}

	setSortingStrategy(strategy: ((a: SearchResult, b: SearchResult) => number)[]): void {
		if (!Array.isArray(strategy)) {
			this.sortingStrategy = [strategy]
		} else {
			this.sortingStrategy = strategy
		}
	}

	setExcludedPaths(paths: (RegExp | string)[]): void {
		if (!paths || !Array.isArray(paths)) {
			this.excludedPaths = []
		} else {
			this.excludedPaths = paths
		}
		this.prepareDataset()
	}

	setIncludedPaths(paths: (RegExp | string)[]): void {
		if (!paths || !Array.isArray(paths)) {
			this.includedPaths = []
		} else {
			this.includedPaths = paths
		}
		this.prepareDataset()
	}

	setDataset(datasetArray: any[]): void {
		this.originalData = deepCopyObject(datasetArray)
		this.prepareDataset()
	}

	setLimit(limit: number): void {
		this.limit = limit
	}

	setIndexStrategy(indexStrategy: IIndex[]): void {
		if (!indexStrategy || !Array.isArray(indexStrategy)) {
			this.indexStrategy = []
		} else {
			this.indexStrategy = indexStrategy
		}
		this.prepareDataset()
	}

	/**
	 * Format the given array of data into an array of Item instances.
	 */
	prepareDataset(): void {
		delete this.items
		this.items = this.originalData.map(item => {
			return new Item(item, this.includedPaths, this.excludedPaths, this.indexStrategy)
		})
	}

	onlineSearch(searchValue: any): SearchResult[] {
		const searchResult = this.traversalStrategy(this.items, searchValue, this.comparisonStrategy, this.limit)
		if (this.sortingStrategy.length > 0) {
			searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
		}
		return searchResult
	}

	offlineSearch(searchValue: any): SearchResult[] {
		return <SearchResult[]> this.items.map(item => item.offlineSearch(searchValue)).filter(result => result)
	}
}
