import Engine from "./Engine"
import { IIndex } from "./Model/Index"
import SearchResult from "./Model/SearchResult"
import IOptions from "./Options"

export default class Jhaystack {
	/** The internal engine object */
	private engine: Engine

	constructor(options?: IOptions) {
		this.engine = new Engine(options)
	}

	/**
	 * Sets the comparison strategy to be used.
	 * @param {((term: string, context: any) => number)[]} strategy - Array of comparison functions to be used
	 * @returns {Jhaystack} - this
	 */
	setComparisonStrategy(strategy: ((term: string, context: any) => number)[]): Jhaystack {
		this.engine.setComparisonStrategy(strategy)
		return this
	}

	/**
	 * Sets the traversal strategy to be used.
	 * @param {(itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]} strategy - Traversal strategy to be used
	 * @returns {Jhaystack} - this
	 */
	setTraversalStrategy(strategy: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]): Jhaystack {
		this.engine.setTraversalStrategy(strategy)
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
	 * Sets the paths that should NOT be traversed.
	 * Excluded paths always take precedence over included paths.
	 * @param {(RegExp|string)[]} paths - Array of regular expressions (strings or RegExp objects) to be evaluated on the path strings.
	 * @returns {Jhaystack} - this
	 */
	setExcludedPaths(paths: (RegExp | string)[]): Jhaystack {
		this.engine.setExcludedPaths(paths)
		return this
	}

	/**
	 * Sets the paths that SHOULD be traversed.
	 * Excluded paths always take precedence over included paths.
	 * @param {(RegExp|string)[]} paths - Array of regular expressions (strings or RegExp objects) to be evaluated on the path strings.
	 * @returns {Jhaystack} - this
	 */
	setIncludedPaths(paths: (RegExp | string)[]): Jhaystack {
		this.engine.setIncludedPaths(paths)
		return this
	}

	/**
	 * Sets the array of data to be searched.
	 * Note that setting this can cause previously configured indexes and path configurations to have to be re-built.
	 * @param {any[]} paths - Array of data to be searched.
	 * @returns {Jhaystack} - this
	 */
	setDataset(dataSet: any[]): Jhaystack {
		this.engine.setDataset(dataSet)
		return this
	}

	/**
	 * Sets the index strategy to be used.
	 * @param {IIndex[]} strategy - Array of indexes to be used
	 * @returns {Jhaystack} - this
	 */
	setIndexStrategy(strategy: IIndex[]): Jhaystack {
		this.engine.setIndexStrategy(strategy)
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
	 * Perform an online search for a given value
	 * @param {any} searchValue - Value to search for
	 * @returns {SearchResult[]} - Search results
	 */
	search(searchValue: any): SearchResult[] {
		return this.engine.onlineSearch(searchValue)
	}

	/**
	 * Perform an offline search for a given value
	 * @param {any} searchValue - Value to search for
	 * @returns {SearchResult[]} - Search results
	 */
	indexLookup(searchValue: any): SearchResult[] {
		return this.engine.offlineSearch(searchValue)
	}
}
