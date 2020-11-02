import { IIndex } from "./Model/Index"
import SearchResult from "./Model/SearchResult"
import { ITraversal } from "./Traversal/TraversalStrategy"

export default interface IOptions {
	/** Array containing the comparison functions to be used for evaluating matches */
	comparison?: ((term: unknown, context: unknown) => number)[]
	/** The traversal strategy to use */
	traversal?: ITraversal
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	sorting?: ((a: SearchResult, b: SearchResult) => number)[]
	/** Maximum number of matches before search ends */
	limit?: null | number
	/** Types of indexes to be built for offline search */
	index?: IIndex[]
	/** Explicit property paths to evaluate during search. Excluded paths always take precedence over included paths */
	includedPaths?: (RegExp | string)[]
	/** Explicit property paths to NOT evaluate during search. Excluded paths always take precedence over included paths */
	excludedPaths?: (RegExp | string)[]
	/** Array of data to be searched */
	data?: any[]
}
