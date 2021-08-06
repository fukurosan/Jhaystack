import IWeighter from "./IWeighter"
import IIndexTokenMeta from "../IIndexTokenMeta"
import { Index } from "../Index"

interface IBM25Options {
	/** When will a term be saturated? The longer the document texts are the higher this value should be. Should be between ~ 0-3. */
	k1: number
	/** When should the length result in term saturation? The specific the document texts are the lower this number should be. Should be between 0-1. */
	b: number
}

const DEFAULT_OPTIONS: IBM25Options = Object.freeze({
	k1: 1.2,
	b: 0.75
})

export class BM25 implements IWeighter {
	/** Configuration for the BM25 module */
	private options: IBM25Options
	/** Index bound tot he BM25 module */
	private index: Index
	/** Is the query unit length? */
	isQueryUnitLength = false
	/** Are the documents unit length? */
	isDocumentUnitLength = false

	constructor(index: Index, options: IBM25Options) {
		this.index = index
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		}
	}

	getIDFMagnitude(term: string) {
		const numberOfDocumentsWithTerm = this.index.getNumberOfDocumentsWithTerm(term)
		return Math.log10(1 + (this.index.getNumberOfDocuments() - numberOfDocumentsWithTerm + 0.5) / (numberOfDocumentsWithTerm + 0.5))
	}

	getTFMagnitude(tokenMap: Map<string, IIndexTokenMeta>) {
		const averageDocumentLength = this.index.getAverageDocumentLength()
		const documentLength = tokenMap.size
		const k1 = this.options.k1
		const b = this.options.b
		for (const [token, meta] of tokenMap) {
			const termFrequency = meta.positions.length
			const number = termFrequency * (k1 + 1)
			const denominator = termFrequency + k1 * (1 - b + b * (documentLength / averageDocumentLength))
			const TF = number / denominator
			meta.magnitude = TF * this.index.getInverseDocumentFrequency(token)
		}
		return tokenMap
	}

	getQueryTFMagnitude(tokenMap: Map<string, IIndexTokenMeta>) {
		return this.getTFMagnitude(tokenMap)
	}
}
