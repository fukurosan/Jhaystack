import Document from "../Model/Document"
import IIndexTokenMeta from "./IIndexTokenMeta"

export default interface IIndexDocument {
	document: Document
	tokenMap: Map<string, IIndexTokenMeta>
	vector: number[]
}
