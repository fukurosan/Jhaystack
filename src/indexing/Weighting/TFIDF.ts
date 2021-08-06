import { Index } from "../Index"
import IIndexTokenMeta from "../IIndexTokenMeta"
import IWeighter from "./IWeighter"

interface ITFIDFOptions {
	/** Three characters defining the tf, idf and normalization type to be used. */
	smartirs?: string | string[]
	/** This by default stops log(0) from happening by always adding 1 to tf. */
	smoothenTF?: boolean
	/** Artifically add one additional document to every IDF calculation that contains every term exactly one time. */
	smoothenIDF?: boolean
	/** Should be TFIDF values be pivot normalized? */
	pivot?: boolean
	/** Amount to pivot (0-1). You may need to experiment with this value. */
	slope?: number
}

const DEFAULT_OPTIONS: ITFIDFOptions = Object.freeze({
	smartirs: "ntc",
	smoothenTF: true,
	smoothenIDF: true,
	pivot: false,
	slope: 0.65
})

export class TFIDF implements IWeighter {
	/** Configuration for the TFIDF module */
	private options: ITFIDFOptions
	/** Index bound tot he TFIDF module */
	private index: Index
	/** Is the query unit length? */
	isQueryUnitLength = false
	/** Are the documents unit length? */
	isDocumentUnitLength = false

	constructor(index: Index, options: ITFIDFOptions) {
		this.index = index
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		}
		if (this.options.smartirs) {
			if (!this.evaluateSMART(this.options.smartirs)) {
				throw new Error("Incorrect smartirs parameter passed to TFIDF weighter module: " + this.options.smartirs)
			}
		}
	}

	getIDFMagnitude(token: string): number {
		return this.generateIDF(token, this.options.smartirs![1], this.options.smoothenIDF)
	}

	getTFMagnitude(tokenMap: Map<string, IIndexTokenMeta>) {
		this.generateTF(tokenMap, this.options.smartirs![0], this.options.smoothenTF)
		this.normalizeTFIDF(tokenMap, this.options.smartirs![2], this.options.pivot, this.options.slope)
		return tokenMap
	}

	getQueryTFMagnitude(tokenMap: Map<string, IIndexTokenMeta>) {
		return this.getTFMagnitude(tokenMap)
	}

	/**
	 * Evaluates if a given string value is a valid smart-parameter
	 * @param {string} value - The value to be evaluated
	 */
	evaluateSMART(value: string | string[]) {
		if (value.length !== 3) {
			return false
		}
		if (typeof value === "string") {
			if (!"nlabL".includes(value[0])) {
				return false
			} else if (!"ntp".includes(value[1])) {
				return false
			} else if (!"ncm".includes(value[2])) {
				return false
			}
			if (value[2] === "c") {
				this.isDocumentUnitLength = true
				this.isQueryUnitLength = true
			}
			return true
		} else {
			if (!"nlabL".includes(value[0]) && !["natural", "logarithmic", "augmented", "maximum", "boolean", "logaverage"].includes(value[0])) {
				return false
			} else if (!"ntp".includes(value[1]) && !["none", "idf", "probabilistic"].includes(value[1])) {
				return false
			} else if (!"ncm".includes(value[2]) && !["none", "cosine", "manhattan"].includes(value[2])) {
				return false
			}
			if (value[2] === "c" || value[2] === "cosine") {
				this.isDocumentUnitLength = true
				this.isQueryUnitLength = true
			}
			return true
		}
	}

	/**
	 * Creates Inverse Document Frequency weights for the index
	 * @param {string} - token to be computed
	 * @param {"n" | "t" | "P" | "none" | "idf" | "probabilistic"} idfType - Type of inverted document frequecy (n -> none, t -> idf, p -> probabilistic idf)
	 * @param {boolean} smoothenIDF - Artifically add one additional document to every IDF calculation that contains every term exactly one time.
	 */
	generateIDF(token: string, idfType = "idf", smoothenIDF = true) {
		let naturalIDF = this.index.getNumberOfDocumentsWithTerm(token)
		if (smoothenIDF && naturalIDF < this.index.getNumberOfDocuments()) {
			naturalIDF += 1
		}
		if (idfType === "none" || idfType === "n") {
			return 1
		} else if (idfType === "idf" || idfType === "t") {
			const toLog = this.index.getNumberOfDocuments() / naturalIDF
			return toLog ? Math.log10(toLog) : 0
		} else if (idfType === "probabilistic" || idfType === "p") {
			const toLog = (this.index.getNumberOfDocuments() - naturalIDF) / naturalIDF
			const loggedValue = toLog ? Math.log10(toLog) : 0
			return Math.max(0, loggedValue)
		} else {
			throw new Error("Invalid IDF type passed to weighter function: " + idfType)
		}
	}

	/**
	 * Creates the Term Frequency mapping for a given document
	 * @param {"n" | "l" | "a" | "b" | "L" | "natural" | "logarithmic" | "augmented" | "boolean" | "logaverage"} tfType - Type of term frequency
	 * @param {boolean} smoothenTF - This by default stops log(0) from happening by always adding 1 to tf.
	 */
	generateTF(tokenMap: Map<string, IIndexTokenMeta>, tfType = "logarithmic", smoothenTF = true) {
		for (const [token, meta] of tokenMap) {
			let TF
			const naturalFrequency = meta.positions.length + (smoothenTF ? 1 : 0)
			if (tfType === "natural" || tfType === "n") {
				TF = naturalFrequency
			} else if (tfType === "logarithmic" || tfType === "l") {
				TF = 1 + Math.log10(naturalFrequency)
			} else if (tfType === "augmented" || tfType === "a") {
				let maxTF = 0
				for (const [, meta] of tokenMap) {
					maxTF < meta.positions.length && (maxTF = meta.positions.length)
				}
				const a = 0.4
				TF = a + (1 - a) * (naturalFrequency / maxTF)
			} else if (tfType === "boolean" || tfType === "b") {
				TF = 1
			} else if (tfType === "logaverage" || tfType === "L") {
				let totalTerms = 0
				for (const [, meta] of tokenMap) {
					totalTerms += meta.positions.length
				}
				const averageTermFrequency = totalTerms / tokenMap.size
				TF = (1 + Math.log10(naturalFrequency)) / (1 + Math.log10(averageTermFrequency))
			} else {
				throw new Error("Invalid TF type passed to weighter: " + tfType)
			}
			meta.magnitude = TF * this.index.getInverseDocumentFrequency(token)
		}
	}

	/**
	 * Normalizes the TFIDF vectors
	 * @param {"n" | "c" | "m" | "none" | "cosine" | "manhattan"} normalizationType - Type of normalization (c -> cosine (L2), m -> manhattan (L1))
	 * @param {boolean} pivot - Should be TFIDF values be pivot normalized?
	 * @param {boolean} pivotSlope - Amount to pivot (0-1). You may need to experiment with this value.
	 */
	normalizeTFIDF(tokenMap: Map<string, IIndexTokenMeta>, normalizationType = "c", pivot = false, pivotSlope = 0.65) {
		//Handle Normalization
		if (normalizationType === "m" || normalizationType === "manhattan") {
			let fullMagnitude = 0
			for (const [, meta] of tokenMap) {
				fullMagnitude += meta.magnitude
			}
			for (const [, meta] of tokenMap) {
				meta.magnitude = meta.magnitude / fullMagnitude
				if (isNaN(meta.magnitude)) {
					meta.magnitude = 0.000000000000001
				}
			}
		} else if (normalizationType === "c" || normalizationType === "cosine") {
			let vectorLength = 0
			for (const [, meta] of tokenMap) {
				vectorLength += meta.magnitude ** 2
			}
			vectorLength = Math.sqrt(vectorLength)
			for (const [, meta] of tokenMap) {
				meta.magnitude = meta.magnitude / vectorLength
				if (isNaN(meta.magnitude)) {
					meta.magnitude = 0.000000000000001
				}
			}
		} else if (normalizationType !== "n" && normalizationType !== "none") {
			throw new Error("Invalid normalization type passed to weighter")
		}
		//Handle pivot of magnitude
		if (pivot) {
			const averageDocumentLength = this.index.getAverageDocumentLength()
			for (const [, meta] of tokenMap) {
				const pivotedNormalization = meta.magnitude / ((1 - pivotSlope) * averageDocumentLength + pivotSlope * meta.magnitude)
				meta.magnitude = Math.abs(pivotedNormalization) > 0.000000000000001 ? pivotedNormalization : 0.000000000000001
			}
		}
	}
}
