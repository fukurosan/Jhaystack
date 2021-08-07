import Engine from "./Engine"
import SearchResult from "./Model/SearchResult"
import IOptions from "./Model/IOptions"
import IExtraction from "./Model/IExtraction"
import IComparison from "./Model/IComparison"
import IFilter from "./Model/IFilter"
import IWeight from "./Model/IWeight"
import IPreProcessor from "./Model/IPreProcessor"
import IIndexOptions from "./indexing/IIndexOptions"
import IClusterSpecification from "./indexing/Clustering/IClusterSpecification"

/**
 * The main Jhaystack class.
 * This is where the adventure starts!
 */
export default class Jhaystack {
	/** The internal engine object */
	private engine: Engine

	constructor(options?: IOptions) {
		this.engine = new Engine(options)
	}

	/**
	 * Sets the value comparison strategy to be used.
	 * @param {IComparison[]} strategy - Array of comparison functions to be used
	 * @returns {Jhaystack} - this
	 */
	setComparisonStrategy(strategy: IComparison[]): Jhaystack {
		this.engine.setComparisonStrategy(strategy)
		return this
	}

	/**
	 * Sets the extraction strategy to be used. I.e. how documents should be extracted from the dataset.
	 * @param {IExtraction} strategy - Extraction strategy to be used
	 * @returns {Jhaystack} - this
	 */
	setExtractionStrategy(strategy: IExtraction): Jhaystack {
		this.engine.setExtractionStrategy(strategy)
		return this
	}

	/**
	 * Sets the sorting strategy to be used.
	 * Search results will be sorted in order of sorting function provided.
	 * @param {(a: SearchResult, b: SearchResult) => number)[]} strategy - Array of Sorting functions to be used
	 * @returns {Jhaystack} - this
	 */
	setSortingStrategy(strategy: ((a: SearchResult, b: SearchResult) => number)[]): Jhaystack {
		this.engine.setSortingStrategy(strategy)
		return this
	}

	/**
	 * Sets the preprocessor functions used for preprocessing the provided search data.
	 * @param {IPreProcessor[]} preProcessors - The array of preprocessor functions
	 * @returns {Jhaystack} - this
	 */
	setPreProcessingStrategy(preProcessors: IPreProcessor[]): Jhaystack {
		this.engine.setPreProcessingStrategy(preProcessors)
		return this
	}

	/**
	 * Sets the filters to be applied to the search data.
	 * @param {IFilter[]} filters - Array of filters to be evaluated on the object property paths and values.
	 * @returns {Jhaystack} - this
	 */
	setFilters(filters: IFilter[]): Jhaystack {
		this.engine.setFilters(filters)
		return this
	}

	/**
	 * Sets the array of data to be searched.
	 * Note that setting this can cause previously configured indices and path configurations to have to be re-built.
	 * You can also add and remove individual items using the addItem and removeItem functions. For smaller changes this is usually prefered.
	 * @param {any[]} dataSet - Array of data to be searched.
	 * @returns {Jhaystack} - this
	 */
	setDataset(dataSet: any[]): Jhaystack {
		this.engine.setDataset(dataSet)
		return this
	}

	/**
	 * Adds an item to the search data.
	 * @param {any} item - item to be added.
	 * @returns {Jhaystack} - this
	 */
	addItem(item: any): Jhaystack {
		this.engine.addItem(item)
		return this
	}

	/**
	 * Removes an item from the search data.
	 * @param {any} item - item to be removed.
	 * @returns {Jhaystack} - this
	 */
	removeItem(item: any): Jhaystack {
		this.engine.removeItem(item)
		return this
	}

	/**
	 * Sets the maximum number of matches to be found before search stops.
	 * @param {number} limit - Maximum number of matches (integer)
	 * @returns {Jhaystack} - this
	 */
	setLimit(limit: number): Jhaystack {
		this.engine.setLimit(limit)
		return this
	}

	/**
	 * Sets relevance weights for given patterns.
	 * Data is provided in the form of an array of arrays. Each inner array contains the evaluation function at index 0, and the weight value at index 1 (> 0, < infinity, default 1).
	 * Weight is determined by the first function in the array that matches.
	 * Default weight is 1.
	 * @param {IWeight[]} weights - The array of weights
	 * @returns {Jhaystack} - this
	 */
	setWeights(weights: IWeight[]): Jhaystack {
		this.engine.setWeights(weights)
		return this
	}

	/**
	 * Should preprocessors be applied to the search term as well?
	 * @param {boolean} shouldApply - The boolean specifying if the preprocessors should be applied or not
	 * @returns {Jhaystack} - this
	 */
	setApplyPreProcessorsToTerm(shouldApply: boolean): Jhaystack {
		this.engine.setApplyPreProcessorsToTerm(shouldApply)
		return this
	}

	/**
	 * Sets the index strategy to use
	 * @param options Options for the index
	 * @param doNotBuild If set to true the index will not immediately be built
	 */
	setIndexStrategy(options: IIndexOptions, doNotBuild?: boolean) {
		return this.engine.setIndexStrategy(options, doNotBuild)
	}

	/**
	 * (re)Builds all indexes
	 */
	buildIndex() {
		return this.engine.buildIndex()
	}

	/**
	 * Sets the cluster strategy to use
	 * @param clusterSpecifications - Cluster specifications
	 * @param doNotBuild If set to true the clusters will not immediately be built
	 */
	setClusterStrategy(clusterSpecifications: IClusterSpecification[], doNotBuild?: boolean) {
		this.engine.setClusterStrategy(clusterSpecifications, doNotBuild)
	}

	/**
	 * Perform a search
	 * @param {any} searchValue - Value to search for
	 * @returns {SearchResult[]} - Search results
	 */
	search(searchValue: any): SearchResult[] {
		return this.engine.search(searchValue)
	}
}
