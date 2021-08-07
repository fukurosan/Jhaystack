import { BITAP } from "./Comparison/Bitap"
import { BY_VALUE } from "./Extraction/ByValue"
import { mergeArraySortFunctions } from "./Utility/JsonUtility"
import Document from "./Model/Document"
import SearchResult from "./Model/SearchResult"
import { RELEVANCE } from "./Sorting/Relevance"
import IOptions from "./Model/IOptions"
import IExtraction from "./Model/IExtraction"
import IComparison from "./Model/IComparison"
import IFilter from "./Model/IFilter"
import IWeight from "./Model/IWeight"
import IPreProcessor from "./Model/IPreProcessor"
import { TO_STRING, TO_LOWER_CASE } from "./PreProcessing/PreProcessingStrategy"
import { FULL_SCAN } from "./Utility/Scan"
import { minMax } from "./Utility/MathUtils"
import Declaration from "./Model/Declaration"
import { Index } from "./indexing/Index"
import IIndexOptions from "./indexing/IIndexOptions"

export default class SearchEngine {
	/** Array containing the comparison functions to be used for evaluating matches */
	private comparisonStrategy: IComparison[]
	/** The extraction strategy to use */
	private extractionStrategy: IExtraction
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	private sortingStrategy: ((a: SearchResult, b: SearchResult) => number)[]
	/** Array of value processors to use for preprocessing the search data values */
	private preProcessingStrategy: IPreProcessor[]
	/** The index strategy to use */
	private indexStrategy: Index | null = null
	/** The processed data set used for searching */
	private corpus: Document[]
	/** The original data set provided by the user */
	private originData: any[]
	/** Maximum number of matches before search ends */
	private limit: number | null
	/** Filters for what data should or should not be searchable */
	private filters: IFilter[]
	/** Weighted pattern functions */
	private weights: IWeight[]
	/** Should preprocessors be applied to the search term as well? */
	private isApplyPreProcessorsToTerm: boolean
	/** Next available document identifier */
	private nextDocumentID = 0

	constructor(options?: IOptions) {
		this.comparisonStrategy = [BITAP]
		this.extractionStrategy = BY_VALUE
		this.sortingStrategy = [RELEVANCE.DESCENDING]
		this.corpus = []
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
			options.filters && this.setFilters(options.filters)
			options.weights && this.setWeights(options.weights)
			options.preProcessing && this.setPreProcessingStrategy(options.preProcessing)
			options.indexing && options.indexing.options && this.setIndexStrategy(options.indexing.options, options.indexing.doNotBuild)
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
			this.corpus.push(new Document(this.nextDocumentID++, item, this.originData.length - 1, this.processDeclarations(declarations, maxWeight)))
		})
	}

	removeItem(item: any) {
		const index = this.originData.indexOf(item)
		if (index !== -1) {
			this.originData.splice(index, 1)
			this.corpus = this.corpus.filter(doc => doc.originIndex !== index)
		}
	}

	setLimit(limit: number): void {
		this.limit = limit
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
				documents.push(new Document(this.nextDocumentID++, this.originData[i], i, declarations))
			}
		}
		this.corpus = documents
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

	setIndexStrategy(options: IIndexOptions, doNotBuild?: boolean) {
		const index = new Index(this.corpus, options)
		if (!doNotBuild) {
			index.build()
		}
		this.indexStrategy = index
	}

	buildIndex() {
		if (this.indexStrategy) {
			this.indexStrategy.build()
		}
	}

	search(searchValueIn: any): SearchResult[] {
		let searchValue = searchValueIn
		if (this.isApplyPreProcessorsToTerm) {
			this.preProcessingStrategy.forEach(processor => (searchValue = processor(searchValue)))
		}
		const searchResult = FULL_SCAN(this.corpus, searchValue, this.comparisonStrategy, this.limit)
		if (this.sortingStrategy.length > 0) {
			searchResult.sort(mergeArraySortFunctions(this.sortingStrategy))
		}
		return searchResult
	}
}
