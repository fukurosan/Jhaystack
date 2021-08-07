import { DocumentID } from "../Model/Document"
import { IIndexStatistics } from "../indexing/IIndexStatistics"
import IIndexDocument from "../indexing/IIndexDocument"

export default interface ICluster {
	id: string
	build: (documents: IIndexDocument[], statistics: IIndexStatistics) => void
	evaluate: (document: IIndexDocument, options?: any) => DocumentID[]
}
