import { DocumentID } from "../../Model/Document"
import { IIndexStatistics } from "../IIndexStatistics"
import IIndexDocument from "../IIndexDocument"

export default interface ICluster {
	id: string
	build: (documents: IIndexDocument[], statistics: IIndexStatistics) => void
	evaluate: (document: IIndexDocument, options?: any) => DocumentID[]
}
