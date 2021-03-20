import { BITAP } from "./Comparison/Bitap"
import { BY_VALUE } from "./Extraction/ByValue"
import { mergeArraySortFunctions } from "./Utility/JsonUtility"
import Document from "./Model/Document"
import SearchResult from "./Model/SearchResult"
import { IIndex } from "./Model/Index"
import { RELEVANCE } from "./Sorting/Relevance"
import IOptions from "./Model/IOptions"
import IExtraction from "./Model/IExtraction"
import IComparison from "./Model/IComparison"
import IFilter from "./Model/IFilter"
import IWeight from "./Model/IWeight"
import IPreProcessor from "./Model/IPreProcessor"
import { TO_STRING, TO_LOWER_CASE } from "./PreProcessing/PreProcessingStrategy"
import { FULL_SCAN } from "./Utility/Scan"
import { minMax } from "./Utility/Relevance"
import Declaration from "./Model/Declaration"

export default class SearchEngine {
	/** Array containing the comparison functions to be used for evaluating matches */
	private comparisonStrategy: IComparison[]
	/** The extraction strategy to use */
	private extractionStrategy: IExtraction
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	private sortingStrategy: ((a: SearchResult, b: SearchResult) => number)[]
	/** Array of value processors to use for preprocessing the search data values */
	private preProcessingStrategy: IPreProcessor[]
	/** The processed data set used for searching */
	private documents: Document[]
	/** The original data set provided by the user */
	private originData: any[]
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
		this.extractionStrategy = BY_VALUE
		this.indexStrategy = []
		this.sortingStrategy = [RELEVANCE.DESCENDING]
		this.documents = []
		this.originData = []
		this.limit = null
		this.filters = []
		this.weights = []
		this.preProcessingStrategy = [TO_STRING, TO_LOWER_CASE]
		this.isApplyPreProcessorsToTerm = true

		if (options) {
			options.comparison && this.setComparisonStrategy(options.comparison)
			options.extraction && this.setExtractionStrategy(options.extraction)
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

	setExtractionStrategy(strategy: IExtraction): void {
		this.extractionStrategy = strategy
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
		this.originData = datasetArray
		this.prepareDataset()
	}

	addItem(item: any) {
		this.originData.push(item)
		const maxWeight = this.getMaxWeight()
		this.extractionStrategy(item).forEach(declarations => {
			this.documents.push(
				new Document(item, this.originData.length - 1, this.processDeclarations(declarations, maxWeight), this.filters, this.indexStrategy)
			)
		})
	}

	removeItem(item: any) {
		const index = this.originData.indexOf(item)
		if (index !== -1) {
			this.originData.splice(index, 1)
			this.documents = this.documents.filter(doc => doc.originIndex !== index)
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
	 * Format the given array of data into an array of Document instances.
	 */
	prepareDataset(): void {
		const documents: Document[] = []
		const maxWeight = this.getMaxWeight()
		for (let i = 0; i < this.originData.length; i++) {
			const extractedDocuments = this.extractionStrategy(this.originData[i])
			for (let j = 0; j < extractedDocuments.length; j++) {
				const declarations = this.processDeclarations(extractedDocuments[j], maxWeight)
				documents.push(new Document(this.originData[i], i, declarations, this.filters, this.indexStrategy))
			}
		}
		this.documents = documents
	}

	getMaxWeight() {
		let maxWeight = 1
		const maxValue = Math.max(...this.weights.map(weight => weight[1]))
		maxValue > 1 && (maxWeight = maxValue)
		return maxWeight
	}

	processDeclarations(declarations: Declaration[], maxWeight: number) {
		return declarations
			.filter(declaration => this.filters.every(filter => filter(declaration.path, declaration.originValue)))
			.map(declaration => {
				if (this.weights.length > 0) {
					declaration.weight = 1
					const customWeight = this.weights.find(weight => weight[0](declaration.path, declaration.originValue))
					if (customWeight) {
						declaration.weight = customWeight[1]
					}
					declaration.normalizedWeight = minMax(declaration.weight, maxWeight, 0)
				}
				this.preProcessingStrategy.forEach(processor => (declaration.value = processor(declaration.value)))
				return declaration
			})
	}

	onlineSearch(searchValueIn: any): SearchResult[] {
		let searchValue = searchValueIn
		if (this.isApplyPreProcessorsToTerm) {
			this.preProcessingStrategy.forEach(processor => (searchValue = processor(searchValue)))
		}
		const searchResult = FULL_SCAN(this.documents, searchValue, this.comparisonStrategy, this.limit)
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
		const searchResult = this.documents.reduce((resultArray: SearchResult[], document: Document) => {
			return [...resultArray, ...document.offlineSearch(searchValue)]
		}, [])
		if (this.sortingStrategy.length > 0) {
			searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
		}
		return searchResult
	}
}
