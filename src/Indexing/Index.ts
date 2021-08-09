import Document, { DocumentID } from "../Model/Document"
import IFilter from "../Model/IFilter"
import IPreProcessor from "../Model/IPreProcessor"
import ITokenizer from "../Model/ITokenizer"
import IIndexTokenMeta from "./IIndexTokenMeta"
import { ObjectLiteral } from "../Utility/JsonUtility"
import IIndexOptions from "./IIndexOptions"
import { WORD } from "../Tokenizer/TokenizerStrategy"
import IRanker from "./Ranking/IRanker"
import { TFIDF } from "./Ranking/rankingStrategy"
import { IIndexStatistics } from "./IIndexStatistics"
import IIndexDocument from "../Model/IIndexDocument"

interface IInvertedIndexRow {
	documents: Set<DocumentID>
	idf: number
}

export class Index {
	/** Filters for the index */
	private filters: IFilter[] = []
	/** PreProcessors for the index */
	private preProcessors: IPreProcessor[] = []
	/** Tokenizer for the index */
	private tokenizer: ITokenizer
	/** Ranker for the index */
	private ranker: IRanker
	/** Should fields be encoded into the tokens? */
	private ENCODE_FIELDS = false

	/** Map that holds Document -> Token Meta Map relation. */
	private forwardIndex: Map<DocumentID, Map<string, IIndexTokenMeta>> = new Map()
	/** Map that holds Token -> Document relation. */
	private invertedIndex: Map<string, IInvertedIndexRow> = new Map()
	/** Map that holds field-key -> token -> Document relation */
	private fieldIndex: Map<string, Map<string, Set<DocumentID>>> = new Map()
	/** Map that holds DocumentID -> Document */
	private documentIndex: Map<DocumentID, Document> = new Map()

	/** Combined length of all tokens in all documents (including repeated tokens!) */
	private totalDocumentLength = 0

	constructor(corpus: Document[], options: IIndexOptions) {
		this.filters = options.filters ? options.filters : []
		this.preProcessors = options.preProcessors ? options.preProcessors : []
		this.tokenizer = options.tokenizer ? options.tokenizer : WORD
		const rankerOptions = options.rankerOptions ? options.rankerOptions : {}
		this.ranker = options.ranker ? new options.ranker(this, rankerOptions) : new TFIDF(this, rankerOptions)
		if (typeof options.encodeFields === "boolean") {
			this.ENCODE_FIELDS = options.encodeFields
		}
		corpus.forEach(document => this.addDocument(document, false))
	}

	/**
	 * (Re)Computes the index. This includes:
	 * Term frequency indices (TFIDF, BM25, etc),
	 * Clusters
	 */
	build() {
		for (const [token] of this.invertedIndex) {
			this.invertedIndex.get(token)!.idf = this.ranker.getIDFMagnitude(token)
		}
		for (const [, tokenMap] of this.forwardIndex) {
			this.ranker.getTFMagnitude(tokenMap)
		}
	}

	/**
	 * Adds a new document to the index
	 * @param document - Document to be added
	 * @param approximateMagnitude - Should the term frequency (magnitude) be approximated using existing data?
	 */
	addDocument(document: Document, approximateMagnitude = true) {
		const documentID = document.id
		this.documentIndex.set(documentID, document)
		const documentTokenMap = this.getDocumentTokenMap(document, approximateMagnitude)
		this.forwardIndex.set(documentID, documentTokenMap)
		for (const [token, meta] of documentTokenMap) {
			//Add the document to the token lookup table
			!this.invertedIndex.has(token) && this.invertedIndex.set(token, { documents: new Set<DocumentID>(), idf: 1 })
			this.invertedIndex.get(token)!.documents.add(documentID)
			this.totalDocumentLength += meta.positions.length
			//Add document to field token table:
			meta.positions.forEach(position => {
				if (!this.fieldIndex.has(position.field)) {
					this.fieldIndex.set(position.field, new Map())
				}
				if (!this.fieldIndex.get(position.field)!.has(token)) {
					this.fieldIndex.get(position.field)!.set(token, new Set())
				}
				this.fieldIndex.get(position.field)!.get(token)!.add(documentID)
			})
		}
	}

	/**
	 * Removes a given document from the index
	 * @param document - Document to be removed
	 */
	removeDocument(document: Document) {
		const documentID = document.id
		const documentTokenMap = this.forwardIndex.get(documentID)!
		for (const [token, meta] of documentTokenMap) {
			this.invertedIndex.get(token)!.documents.delete(documentID)
			this.totalDocumentLength -= meta.positions.length
			meta.positions.forEach(position => {
				this.fieldIndex.get(position.field)!.get(token)!.delete(documentID)
			})
		}
		this.forwardIndex.delete(documentID)
		this.documentIndex.delete(documentID)
	}

	/**
	 * Retrieves all index documents.
	 */
	getAllIndexDocuments(): IIndexDocument[] {
		return Array.from(this.forwardIndex.keys()).map(id => this.getIndexDocumentByID(id))
	}

	/**
	 * Retrieves a dense vector of a given document ID
	 * @param id - Document ID that is the owner of the vector
	 */
	getDenseVectorByID(id: DocumentID): number[] {
		if (!this.forwardIndex.has(id)) {
			throw new Error("No such ID exists in the index: " + id)
		}
		return this.getDenseVectorFromTokenMap(this.forwardIndex.get(id)!)
	}

	/**
	 * Computes a document token map for a given document.
	 * @param document - Document to compute
	 * @param approximateMagnitude - Should the term frequency (magnitude) be approximated using existing data?
	 */
	private getDocumentTokenMap(document: Document, approximateMagnitude = false) {
		const documentTokenMap = new Map<string, IIndexTokenMeta>()
		document.declarations
			.filter(declaration => this.filters.every(filter => filter(declaration.path, declaration.value)))
			.forEach(declaration => {
				const value = this.preProcessors.reduce((acc, processor) => processor(acc), declaration.value)
				const declarationTokenMap = this.tokenizer(value)
				for (const token in declarationTokenMap) {
					let tokenMeta: IIndexTokenMeta
					if (documentTokenMap.has(token)) {
						tokenMeta = documentTokenMap.get(token)!
					} else {
						tokenMeta = {
							magnitude: 1,
							positions: []
						}
						const encodedToken = this.ENCODE_FIELDS ? `${declaration.normalizedPath}.${token}` : token
						documentTokenMap.set(encodedToken, tokenMeta)
					}
					for (let n = 0; n < declarationTokenMap[token].length; n++) {
						const position = declarationTokenMap[token][n]
						tokenMeta.positions.push({
							field: declaration.normalizedPath,
							offsetStart: position.offsetStart,
							offsetEnd: position.offsetEnd,
							position: position.position
						})
					}
				}
			})
		approximateMagnitude && this.ranker.getTFMagnitude(documentTokenMap)
		return documentTokenMap
	}

	/**
	 * Get total number of documents in the index
	 * @returns {number} - Total number of documents in the index
	 */
	getNumberOfDocuments(): number {
		return this.forwardIndex.size
	}

	/**
	 * Get number of tokens in the index
	 * @returns {number} - Total Number of unique tokens in the index
	 */
	getNumberOfTokens(): number {
		return this.invertedIndex.size
	}

	/**
	 * Get average document length in the index
	 * @returns {number} - Average document length of the full index
	 */
	getAverageDocumentLength(): number {
		return this.totalDocumentLength / this.forwardIndex.size
	}

	getStatistics(): IIndexStatistics {
		return {
			numberOfDocuments: this.getNumberOfDocuments(),
			numberOfTokens: this.getNumberOfTokens(),
			averageDocumentLength: this.getAverageDocumentLength()
		}
	}

	/**
	 * Gets the inverse document frequency for a given term
	 * @param {string} term - Term to be evaluated
	 * @returns {number} - IDF value for the term
	 */
	getInverseDocumentFrequency(term: string): number {
		const documentFrequency = this.invertedIndex.get(term)?.idf
		return typeof documentFrequency === "number" ? documentFrequency : 0
	}

	/**
	 * Gets the total number of documents that contain the given term.
	 * @param {string} term - Term to be evaluated
	 * @returns {number} - Number of documents that contain the term
	 */
	getNumberOfDocumentsWithTerm(term: string): number {
		const documentsWithTerm = this.invertedIndex.get(term)?.documents
		return documentsWithTerm ? documentsWithTerm.size : 0
	}

	/**
	 * Converts two documents to comparable numeric vectors
	 */
	convertDocumentsToMatchingSparseVectors(document1: Map<string, IIndexTokenMeta>, document2: Map<string, IIndexTokenMeta>): [number[], number[]] {
		const vector1: number[] = []
		const vector2: number[] = []
		const seenVector: ObjectLiteral = {}
		for (const [token, meta] of document1) {
			if (seenVector[token]) {
				continue
			}
			seenVector[token] = 1
			vector1.push(meta.magnitude)
			vector2.push(document2.has(token) ? document2.get(token)!.magnitude : 0)
		}
		for (const [token, meta] of document2) {
			if (seenVector[token]) {
				continue
			}
			seenVector[token] = 1
			vector2.push(meta.magnitude)
			vector1.push(document1.has(token) ? document1.get(token)!.magnitude : 0)
		}
		return [vector1, vector2]
	}

	/**
	 * Converts a map of tokens to IIndexTokenMeta to a full size vector
	 * @param doc The token to IIndexTokenMeta map to be converted
	 */
	private getDenseVectorFromTokenMap(doc: Map<string, IIndexTokenMeta>): number[] {
		const vector: number[] = []
		for (const [token] of this.invertedIndex) {
			vector.push(doc.has(token) ? doc.get(token)!.magnitude : 0)
		}
		return vector
	}

	/**
	 * Retrieve all document IDs with a given term
	 * @param term Term that documents should contain
	 */
	getDocumentIDsWithTerm(term: string): IInvertedIndexRow | null {
		return this.invertedIndex.has(term) ? this.invertedIndex.get(term)! : null
	}

	/**
	 * Retrieves an index document
	 * @param id - ID of the document
	 */
	getIndexDocumentByID(id: DocumentID): IIndexDocument {
		return {
			document: this.documentIndex.get(id)!,
			tokenMap: this.forwardIndex.get(id)!,
			vector: this.getDenseVectorByID(id)
		}
	}

	/**
	 * Finds all document IDs compatible with the search document
	 * @param doc - The string to the searched for.
	 * @param filter - A filter of document IDs to quicker narrow down the search.
	 * @param exactPosition - Should the token positions be exact?
	 * @param field - An optional specific field to be searched. Note that if fields are encoded in the index then this becomes a mandatory property.
	 */
	inexactKRetrievalByDocument(
		doc: Document,
		filter?: DocumentID[],
		exactPosition?: boolean,
		field?: string
	): { queryVector: number[]; documents: DocumentID[] } {
		//Validate input
		if (this.ENCODE_FIELDS && !field) {
			console.error("Invalid query. No field was specified, but ENCODE_FIELDS is set to true.")
			return {
				queryVector: [],
				documents: []
			}
		} else if (field && !this.fieldIndex.has(field)) {
			console.error("Invalid query. No such field exists: " + field)
			return {
				queryVector: [],
				documents: []
			}
		}
		//Compute document list
		const tokenMap = this.getDocumentTokenMap(doc, false)
		this.ranker.getQueryTFMagnitude(tokenMap)
		let documents: Set<DocumentID>[] = []
		//Handle field encoding for the query
		if (this.ENCODE_FIELDS) {
			for (const [token, meta] of tokenMap) {
				tokenMap.set(`${field}.${token}`, meta)
				tokenMap.delete(token)
			}
		}
		for (const [token] of tokenMap) {
			if (!this.invertedIndex.has(token)) {
				//If the token does not exist we return an empty result
				return {
					queryVector: [],
					documents: []
				}
			}
			if (this.ENCODE_FIELDS || !field) {
				//If fields are encoded or no field was specified then we can use the standard inverted index
				documents.push(this.invertedIndex.get(token)!.documents)
			} else {
				//If fields are not encoded but a field was specified then we need to use the field index
				documents.push(this.fieldIndex.get(field)!.get(token)!)
			}
		}
		documents = documents.sort((a, b) => a.size - b.size)
		const smallestSet = filter ? filter : documents.shift()! //Always put the filter first if one exists
		const intersection = Array.from(smallestSet).reduce((acc: DocumentID[], curr) => {
			for (let i = 0; i < documents.length; i++) {
				if (!documents[i].has(curr)) {
					return acc
				}
			}
			acc.push(curr)
			return acc
		}, [])
		if (exactPosition) {
			//We need to confirm that the position of all tokens are in the same order as in the query document
			const flatTokenMap = new Map()
			for (const [token, meta] of tokenMap) {
				meta.positions.forEach(position => {
					flatTokenMap.set(position.position, token)
				})
			}
			const tokenList = Array.from(flatTokenMap.keys())
				.sort()
				.map(key => flatTokenMap.get(key))
			if (tokenList.length === 1) {
				return {
					queryVector: this.getDenseVectorFromTokenMap(tokenMap),
					documents: intersection
				}
			}
			const firstToken = tokenList.shift()
			const exactIntersection = intersection.filter(documentID => {
				const documentTokens = this.forwardIndex.get(documentID)!
				let nextValidPositions = documentTokens.get(firstToken)!.positions.map(position => position.position + 1)
				for (let i = 0; i < tokenList.length; i++) {
					const nextToken = tokenList[i]
					nextValidPositions = documentTokens
						.get(nextToken)!
						.positions.filter(position => nextValidPositions.includes(position.position))
						.map(position => position.position + 1)
					if (!nextValidPositions.length) {
						return false
					}
				}
				return true
			})
			return {
				queryVector: this.getDenseVectorFromTokenMap(tokenMap),
				documents: exactIntersection
			}
		}
		return {
			queryVector: this.getDenseVectorFromTokenMap(tokenMap),
			documents: intersection
		}
	}

}
