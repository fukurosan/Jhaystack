import { BITAP } from "./Comparison/Bitap"
import { FIND_VALUES } from "./Traversal/FindValues"
import { mergeArraySortFunctions } from "./Utility/JsonUtility"
import Item from "./Model/Item"
import SearchResult from "./Model/SearchResult"
import { IIndex } from "./Model/Index"
import { RELEVANCE } from "./Sorting/Relevance"
import IOptions from "./Model/IOptions"
import ITraversal from "./Model/ITraversal"
import IComparison from "./Model/IComparison"
import IFilter from "./Model/IFilter"
import IWeight from "./Model/IWeight"
import IPreProcessor from "./Model/IPreProcessor"
import { TO_STRING, TO_LOWER_CASE } from "./PreProcessing/PreProcessingStrategy"

export default class SearchEngine {
	/** Array containing the comparison functions to be used for evaluating matches */
	private comparisonStrategy: IComparison[]
	/** The traversal strategy to use */
	private traversalStrategy: ITraversal
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	private sortingStrategy: ((a: SearchResult, b: SearchResult) => number)[]
	/** Array of value processors to use for preprocessing the search data values */
	private preProcessingStrategy: IPreProcessor[]
	/** The processed data set used for searching */
	private items: Item[]
	/** The original data set provided by the user */
	private originalData: any[]
	/** Types of indices to be built for offline search */
	private indexStrategy: IIndex[]
	/** Maximum number of matches before search ends */
	private limit: number | null
	/** Filters for what data should or should not be searchable */
	private filters: IFilter[]
	/** Weighted pattern functions */
	private weights: IWeight[]
	/** Should preprocessors be applied to the search term as well? */
	private isApplyPreProcessorsToTerm: boolean

	constructor(options?: IOptions) {
		this.comparisonStrategy = [BITAP]
		this.traversalStrategy = FIND_VALUES
		this.indexStrategy = []
		this.sortingStrategy = [RELEVANCE.DESCENDING]
		this.items = []
		this.originalData = []
		this.limit = null
		this.filters = []
		this.weights = []
		this.preProcessingStrategy = [TO_STRING, TO_LOWER_CASE]
		this.isApplyPreProcessorsToTerm = true

		if (options) {
			options.comparison && this.setComparisonStrategy(options.comparison)
			options.traversal && this.setTraversalStrategy(options.traversal)
			options.sorting && this.setSortingStrategy(options.sorting)
			options.limit && this.setLimit(options.limit)
			options.index && this.setIndexStrategy(options.index)
			options.filters && this.setFilters(options.filters)
			options.weights && this.setWeights(options.weights)
			options.preProcessing && this.setPreProcessingStrategy(options.preProcessing)
			typeof options.applyPreProcessorsToTerm === "boolean" && (this.isApplyPreProcessorsToTerm = options.applyPreProcessorsToTerm)
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

	setPreProcessingStrategy(strategy: IPreProcessor[]) {
		this.preProcessingStrategy = strategy
		this.prepareDataset()
	}

	setFilters(filters: IFilter[]): void {
		if (!filters || !Array.isArray(filters)) {
			this.filters = []
		} else {
			this.filters = filters
		}
		this.prepareDataset()
	}

	setDataset(datasetArray: any[]): void {
		this.originalData = datasetArray
		this.prepareDataset()
	}

	addItem(item: any) {
		this.originalData.push(item)
		this.items.push(new Item(item, this.originalData.length - 1, this.filters, this.indexStrategy, this.weights, this.preProcessingStrategy))
	}

	removeItem(item: any) {
		const index = this.originalData.indexOf(item)
		if (index !== -1) {
			this.originalData.splice(index, 1)
			this.items.splice(index, 1)
			for (let i = index; i < this.items.length; i++) {
				this.items[i].originalIndex--
			}
		}
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

	setWeights(weights: IWeight[]): void {
		if (!weights || !Array.isArray(weights)) {
			this.weights = []
		} else {
			this.weights = weights
		}
		this.prepareDataset()
	}

	setApplyPreProcessorsToTerm(shouldApply: boolean): void {
		this.isApplyPreProcessorsToTerm = shouldApply
	}

	/**
	 * Format the given array of data into an array of Item instances.
	 */
	prepareDataset(): void {
		this.items = this.originalData.map((item, index) => {
			return new Item(item, index, this.filters, this.indexStrategy, this.weights, this.preProcessingStrategy)
		})
	}

	onlineSearch(searchValueIn: any): SearchResult[] {
		let searchValue = searchValueIn
		if (this.isApplyPreProcessorsToTerm) {
			this.preProcessingStrategy.forEach(processor => (searchValue = processor(searchValue)))
		}
		const searchResult = this.traversalStrategy(this.items, searchValue, this.comparisonStrategy, this.limit)
		if (this.sortingStrategy.length > 0) {
			searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
		}
		return searchResult
	}

	offlineSearch(searchValueIn: any): SearchResult[] {
		let searchValue = searchValueIn
		if (this.isApplyPreProcessorsToTerm) {
			this.preProcessingStrategy.forEach(processor => (searchValue = processor(searchValue)))
		}
		const searchResult = this.items.reduce((resultArray: SearchResult[], item: Item) => {
			return [...resultArray, ...item.offlineSearch(searchValue)]
		}, [])
		if (this.sortingStrategy.length > 0) {
			searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
		}
		return searchResult
	}
}
