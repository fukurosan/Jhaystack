import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { getRelativeRelevance } from "../Utility/Mathematics"
import { pathValidator } from "../Validation/Validation"
import Shard from "./Shard"
import Index, { IIndex } from "./Index"
import SearchResult from "./SearchResult"

export default class Item {
	/** The original object */
	original: any
	/** All values found nested inside of the original object */
	shards: Shard[]
	/** All indexes used for offline searches of the item */
	indexes: Index[]

	constructor(original: any, includedPaths: (RegExp | string)[], excludedPaths: (RegExp | string)[], indexes: IIndex[]) {
		this.original = deepCopyObject(original)
		this.shards = flattenObject(this.original).filter(shard => pathValidator(shard.path, includedPaths, excludedPaths))
		this.indexes = indexes.map(IndexImplementation => new IndexImplementation(this.shards))
	}

	/**
	 * Performs an offline search of the item for a given term. Always returns the best possible match.
	 * @param {unknown} term - The term to be searched for
	 * @returns {SearchResult|null} - SearchResult or null if no result was found
	 */
	offlineSearch(term: unknown): SearchResult | null {
		for (let i = 0; i < this.indexes.length; i++) {
			const result = this.indexes[i].evaluate(term)
			if (result.score && result.shard) {
				return new SearchResult(
					this.original,
					result.shard.path,
					result.shard.value,
					getRelativeRelevance(this.indexes.length, i + 1, result.score),
					result.score,
					i
				)
			}
		}
		return null
	}
}
