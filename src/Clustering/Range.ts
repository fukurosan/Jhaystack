import ICluster from "../Model/ICluster"
import { DocumentID } from "../Model/Document"
import IIndexDocument from "../Model/IIndexDocument"

interface IRangeClusterOptions {
	field: string
	transformer?: (value: any) => number
}

interface IRangeClusterQuery {
	lessThan?: any
	greaterThan?: any
}

export class Range implements ICluster {
	/** Identifier for the cluster within the index */
	id: string
	/** Configuration for the range cluster module */
	private options: IRangeClusterOptions
	/** A sorted list of all indexed values */
	private sortedIndex: [DocumentID, any][] = []
	/** Transformer function for provided values */
	private transformer

	constructor(id: any, options: IRangeClusterOptions) {
		this.id = id
		this.transformer = options.transformer
		this.options = options
	}

	evaluate(document?: IIndexDocument, options?: IRangeClusterQuery): DocumentID[] {
		if (!options!.greaterThan && !options!.lessThan) {
			return []
		}
		if (this.sortedIndex.length === 0) {
			return []
		}
		//TODO:: This can be sped up significantly in the future
		const result = []
		const greaterThan = options?.greaterThan ? options.greaterThan : -Infinity
		const lessThan = options?.lessThan ? options.lessThan : Infinity
		for (let i = 0; i < this.sortedIndex.length; i++) {
			const item = this.sortedIndex[i]
			if (item[1] >= lessThan) {
				break
			}
			if (item[1] > greaterThan) {
				result.push(item[0])
			}
		}
		return result
	}

	build(documents: IIndexDocument[]) {
		this.buildCluster(documents)
	}

	getData() {
		return this.sortedIndex
	}

	/**
	 * Creates a sorted array of values to be used for range evaluation
	 * @param {IIndexDocument[]} documents - All documents
	 */
	buildCluster(documents: IIndexDocument[]): void {
		//eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.sortedIndex = documents
			.map(doc => {
				const declaration = doc.document.declarations.find(declaration => declaration.normalizedPath === this.options.field)
				if (!declaration) {
					return null
				} else {
					return [doc.document.id, this.transformer ? this.transformer(declaration.originValue) : declaration.originValue]
				}
			})
			.filter(declaration => declaration !== null)
			.sort((a, b) => a![1] - b![1])
	}
}
