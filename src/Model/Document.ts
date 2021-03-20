import { getRelativeRelevance } from "../Utility/Relevance"
import Declaration from "./Declaration"
import Index, { IIndex } from "./Index"
import SearchResult from "./SearchResult"
import IFilter from "./IFilter"

export default class Document {
	/** The origin object */
	origin: any
	/** The index of the origin object in the origin array */
	originIndex: number
	/** All values found nested inside of the origin object */
	declarations: Declaration[]
	/** All indices used for offline searches of the item */
	indices: Index[]

	constructor(origin: any, originIndex: number, declarations: Declaration[], filters: IFilter[], indices: IIndex[]) {
		this.origin = origin
		this.originIndex = originIndex
		this.declarations = declarations
		this.indices = indices.map(IndexImplementation => new IndexImplementation(this.declarations))
	}

	/**
	 * Performs an offline search of the item for a given term. Always returns the best possible match.
	 * @param {unknown} term - The term to be searched for
	 * @returns {SearchResult[]|null} - SearchResults
	 */
	offlineSearch(term: unknown): SearchResult[] {
		const seen = new Set()
		const finalResults: SearchResult[] = []
		for (let i = 0; i < this.indices.length; i++) {
			const indexResult = this.indices[i].evaluate(term)
			if (indexResult.length > 0) {
				indexResult.forEach(indexEvaluationResult => {
					if (!seen.has(indexEvaluationResult.declaration)) {
						seen.add(indexEvaluationResult.declaration)
						finalResults.push(
							new SearchResult(
								this.origin,
								this.originIndex,
								indexEvaluationResult.declaration.path,
								indexEvaluationResult.declaration.value,
								getRelativeRelevance(
									this.indices.length,
									i + 1,
									indexEvaluationResult.score * indexEvaluationResult.declaration.normalizedWeight
								),
								indexEvaluationResult.score,
								i,
								indexEvaluationResult.declaration.weight,
								indexEvaluationResult.declaration.normalizedWeight
							)
						)
					}
				})
			}
		}
		return finalResults
	}
}
