import { IQuery } from "./IQuery"

interface ISearchOptions {
	/** Optimal number of matches required */
	limit?: number
}

export interface ISearchOptionsSearch extends ISearchOptions {
	/** Optional query to be used for inexact k retrieval */
	filter?: IQuery
}

export interface ISearchOptionsFullText extends ISearchOptions {
	/** Optional query to be used for inexact k retrieval */
	filter?: IQuery
	exact?: boolean
	field?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISearchOptionsQuery extends ISearchOptions {}
