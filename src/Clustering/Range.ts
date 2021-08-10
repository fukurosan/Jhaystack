import ICluster from "./ICluster"
import { DocumentID } from "../Model/Document"
import IIndexDocument from "../Model/IIndexDocument"

interface IRangeClusterOptions {
	field: string
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

	constructor(id: any, options: IRangeClusterOptions) {
		this.id = id
		this.options = options
	}

	evaluate(document?: IIndexDocument, options?: IRangeClusterQuery): DocumentID[] {
		if (!options!.greaterThan && !options!.lessThan) {
			return []
		}
		let result = this.sortedIndex
		//TODO:: This can be sped up significantly in the future
		if (options!.greaterThan) {
			result = result.filter(item => item[1] > options!.greaterThan)
		}
		if (options!.lessThan) {
			result = result.filter(item => item[1] < options!.lessThan)
		}
		return result.map(item => item[0])
	}

	build(documents: IIndexDocument[]) {
		this.buildCluster(documents)
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
					return [doc.document.id, declaration.originValue]
				}
			})
			.filter(declaration => declaration !== null)
			.sort((a, b) => a![1] - b![1])
	}
}
