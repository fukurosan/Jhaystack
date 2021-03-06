import { IIndex } from "./Index"
import SearchResult from "./SearchResult"
import IComparison from "./IComparison"
import IFilter from "./IFilter"
import IWeight from "./IWeight"
import IPreProcessor from "./IPreProcessor"
import IExtraction from "./IExtraction"

export default interface IOptions {
	/** Array containing the comparison functions to be used for evaluating matches. */
	comparison?: IComparison[]
	/** Sets the extraction strategy to be used. I.e. how documents should be extracted from the dataset. */
	extraction?: IExtraction
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	sorting?: ((a: SearchResult, b: SearchResult) => number)[]
	/** Maximum number of matches before search ends */
	limit?: null | number
	/** Type of indices to be built for offline search */
	index?: IIndex[]
	/** Filters for what data should or should not be searchable */
	filters?: IFilter[]
	/** Weight functions that determine how certain property paths and values should be weighed in terms of their relevance. */
	weights?: IWeight[]
	/** Pre processor functions used for preprocessing the provided search data. E.g. "make all strings upper case", or "make all data objects into a string of format yyyy-MM-dd". */
	preProcessing?: IPreProcessor[]
	/** Should preprocessors be applied to the search term as well? */
	applyPreProcessorsToTerm?: boolean
	/** Array of data to be searched */
	data?: any[]
}
