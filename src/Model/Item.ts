import { flattenObject } from "../Utility/JsonUtility"
import { minMax, getRelativeRelevance } from "../Utility/Relevance"
import Shard from "./Shard"
import Index, { IIndex } from "./Index"
import SearchResult from "./SearchResult"
import IFilter from "./IFilter"
import IWeight from "./IWeight"
import IPreProcessor from "./IPreProcessor"

export default class Item {
	/** The original object */
	original: any
	/** The index of the original object in the original array */
	originalIndex: number
	/** All values found nested inside of the original object */
	shards: Shard[]
	/** All indices used for offline searches of the item */
	indices: Index[]

	constructor(original: any, originalIndex: number, filters: IFilter[], indices: IIndex[], weights: IWeight[], preProcessingFunctions: IPreProcessor[]) {
		this.original = original
		this.originalIndex = originalIndex
		this.shards = flattenObject(this.original).filter(shard => filters.every(filter => filter(shard.path, shard.originalValue)))
		if (weights.length > 0) {
			let maxWeight = 1
			const maxValue = Math.max(...weights.map(weight => weight[1]))
			maxValue > 1 && (maxWeight = maxValue)
			this.shards.forEach(shard => {
				shard.weight = 1
				const customWeight = weights.find(weight => weight[0](shard.path, shard.originalValue))
				if (customWeight) {
					shard.weight = customWeight[1]
				}
				shard.normalizedWeight = minMax(shard.weight, maxWeight, 0)
			})
		}
		this.shards.forEach(shard => preProcessingFunctions.forEach(processor => (shard.value = processor(shard.value))))
		this.indices = indices.map(IndexImplementation => new IndexImplementation(this.shards))
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
					if (!seen.has(indexEvaluationResult.shard)) {
						seen.add(indexEvaluationResult.shard)
						finalResults.push(
							new SearchResult(
								this.original,
								this.originalIndex,
								indexEvaluationResult.shard.path,
								indexEvaluationResult.shard.value,
								getRelativeRelevance(this.indices.length, i + 1, indexEvaluationResult.score * indexEvaluationResult.shard.normalizedWeight),
								indexEvaluationResult.score,
								i,
								indexEvaluationResult.shard.weight,
								indexEvaluationResult.shard.normalizedWeight
							)
						)
					}
				})
			}
		}
		return finalResults
	}
}
