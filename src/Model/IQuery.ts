import IComparison from "./IComparison"

interface QueryCriteria {
	/** The type of criteria */
	type: string
	/** If configured will inform the query planner about how heavy this operation is. Less heavy operations are generally executed first. */
	cost?: number
}

/** Query for the cluster strategy */
export interface IClusterQueryCriteria extends QueryCriteria {
	/** Mandatory type needed by the query planner */
	type: "cluster"
	/** ID of the cluster */
	id: string
	/** Options for the cluster query */
	options?: any
}

/** Query for the index strategy */
export interface IIndexQueryCriteria extends QueryCriteria {
	/** Mandatory type needed by the query planner */
	type: "index"
	/** Value to search for */
	value: string
	/** Does the position of the tokens of the term matter? */
	exact?: boolean
	/** If only a specific field should be used it can be specified here as a "." (dot) separated string */
	field?: string
}

/** Query using value similarity approximation */
export interface IComparisonQueryCriteria extends QueryCriteria {
	/** Mandatory type needed by the query planner */
	type: "comparison"
	/** Value to search for */
	value: any
	/** Comparison function to be used */
	strategy?: IComparison
	/** If only a specific field should be used it can be specified here as a "." (dot) separated string */
	field?: string
}

export type IQueryCriteria = IIndexQueryCriteria | IClusterQueryCriteria | IComparisonQueryCriteria
export type IQueryItem = "AND" | "OR" | IQueryCriteria
export type IQuery = Array<IQueryItem | IQuery>
