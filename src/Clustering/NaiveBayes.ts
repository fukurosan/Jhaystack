import ICluster from "../Model/ICluster"
import Document, { DocumentID } from "../Model/Document"
import IIndexDocument from "../Model/IIndexDocument"
import { PORTER2 } from "../PreProcessing/Porter2"
import { SCRUB } from "../PreProcessing/Scrub"

interface INaiveBayesClusterQuery {
	field?: string
	category?: string
}

interface INaiveBayesClusterOptions {
	training: [string, string][] | ((obj: any) => [string, string])
	field?: string
}

interface ITokenCategoryData {
	tokenSeenCount: number
	frequency: number
	probability: number
}

const DEFAULT_OPTIONS: INaiveBayesClusterOptions = Object.freeze({
	training: () => {
		throw new Error("No training parameters were configured for the Naive Bayes cluster module")
	}
})

export class NaiveBayes implements ICluster {
	/** Identifier for the cluster within the index */
	id: string
	/** Configuration for the NaiveBayesCluster module */
	private options: INaiveBayesClusterOptions
	/** Map of all tokens and their usage within categories; token -> category -> meta */
	private tokenIndex: Map<string, Map<string, ITokenCategoryData>> = new Map()
	/** Maps Categories to the document count in the training set; category -> count */
	private categoryDocumentCount: Map<string, number> = new Map()
	/** Lookup table for what document IDs belong to what categories; category -> documentIDs */
	private categoryDocumentIndex: Map<string, DocumentID[]> = new Map()

	constructor(id: any, options: INaiveBayesClusterOptions) {
		this.id = id
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		}
	}

	evaluate(document?: IIndexDocument, options?: INaiveBayesClusterQuery): DocumentID[] {
		if (options?.category) {
			return this.categoryDocumentIndex.has(options.category) ? this.categoryDocumentIndex.get(options.category)! : []
		}
		const tokens = this.getTokensFromDocument(document!.document, options?.field)
		const result = this.getCategory(tokens)
		return this.categoryDocumentIndex.get(result)!
	}

	build(documents: IIndexDocument[]) {
		//Compute tokens
		const handleRow = (row: [string, string]) => {
			const category = row[1]
			if (!this.categoryDocumentCount.has(category)) {
				this.categoryDocumentCount.set(category, 1)
			} else {
				this.categoryDocumentCount.set(category, this.categoryDocumentCount.get(category)! + 1)
			}
			;(<string[]>Array.from(new Set(this.getTokensFromValue(row[0])))).forEach((token: string) => {
				!this.tokenIndex.has(token) && this.tokenIndex.set(token, new Map())
				const tokenMeta = this.tokenIndex.get(token)!
				!tokenMeta.has(category) && tokenMeta.set(category, { tokenSeenCount: 0, frequency: 0, probability: 0 })
				tokenMeta.get(category)!.tokenSeenCount += 1
			})
		}
		if (typeof this.options.training === "function") {
			for (let i = 0; i < documents.length; i++) {
				const row = this.options.training(documents[i].document.origin)
				handleRow(row)
			}
		} else {
			for (let i = 0; i < this.options.training.length; i++) {
				const row = this.options.training[i]
				handleRow(row)
			}
		}
		//Compute probabilities
		for (const [, tokenCategoryMap] of this.tokenIndex) {
			for (const [category, documentCountWithCategory] of this.categoryDocumentCount) {
				if (!tokenCategoryMap.has(category)) {
					tokenCategoryMap.set(category, { tokenSeenCount: 0, frequency: 0, probability: 0 })
				}
				const tokenCategoryData = tokenCategoryMap.get(category)!
				tokenCategoryData.frequency = tokenCategoryData.tokenSeenCount / documentCountWithCategory
			}
		}
		for (const [, tokenCategoryMap] of this.tokenIndex) {
			const totalFrequencyForToken = Array.from(this.categoryDocumentCount.keys()).reduce(
				(acc, category) => acc + tokenCategoryMap.get(category)!.frequency,
				0
			)
			for (const [category] of this.categoryDocumentCount) {
				const tokenCategory = tokenCategoryMap.get(category)!
				tokenCategory.probability = Math.max(0.01, Math.min(0.99, tokenCategory.frequency / totalFrequencyForToken))
			}
		}
		//Compute document category index
		documents.forEach(doc => {
			const category = this.getCategory(this.getTokensFromDocument(doc.document))
			!this.categoryDocumentIndex.has(category) && this.categoryDocumentIndex.set(category, [])
			this.categoryDocumentIndex.get(category)!.push(doc.document.id)
		})
	}

	private getTokensFromValue(value: any) {
		return PORTER2(SCRUB(`${value}`))
			.toLowerCase()
			.split(/\W+/)
	}

	private getTokensFromDocument(doc: Document, field?: string) {
		return doc.declarations.reduce((acc: string[], declaration) => {
			if (!field || declaration.normalizedPath === field) {
				return [...acc, ...this.getTokensFromValue(declaration.value)]
			}
			return acc
		}, [])
	}

	private getCategory(tokens: string[]): string {
		const validatedTokenlist: Map<string, ITokenCategoryData>[] = []
		tokens.forEach(token => {
			if (this.tokenIndex.has(token)) {
				validatedTokenlist.push(this.tokenIndex.get(token)!)
			}
		})
		let sum = 0
		const products = Array.from(this.categoryDocumentCount.keys()).reduce((acc, category) => {
			acc.set(
				category,
				validatedTokenlist.reduce((acc, token) => {
					return acc * token.get(category)!.probability
				}, 1)
			)
			sum += acc.get(category)
			return acc
		}, new Map())
		const results: Map<string, number> = new Map()
		Array.from(this.categoryDocumentCount.keys()).forEach(category => {
			results.set(category, products.get(category) / sum)
		})
		let bestMatch = ["", 0]
		for (const [category, score] of results) {
			if (score > bestMatch[1]) {
				bestMatch = [category, score]
			}
		}
		return <string>bestMatch[0]
	}
}
