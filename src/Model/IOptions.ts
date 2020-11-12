import { IIndex } from "./Index"
import SearchResult from "./SearchResult"
import ITraversal from "./ITraversal"
import IComparison from "./IComparison"
import IFilter from "./IFilter"
import IWeight from "./IWeight"
import IPreProcessor from "./IPreProcessor"

export default interface IOptions {
	/** Array containing the comparison functions to be used for evaluating matches */
	comparison?: IComparison[]
	/** The traversal strategy to use */
	traversal?: ITraversal
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	sorting?: ((a: SearchResult, b: SearchResult) => number)[]
	/** Maximum number of matches before search ends */
	limit?: null | number
	/** Types of indices to be built for offline search */
	index?: IIndex[]
	/** Filters for what data should or should not be searchable */
	filters?: IFilter[]
	/** Weighted pattern functions */
	weights?: IWeight[]
	/** Pre processor functions */
	preProcessing?: IPreProcessor[]
	/** Should preprocessors be applied to the search term as well? */
	applyPreProcessorsToTerm?: boolean
	/** Array of data to be searched */
	data?: any[]
}
