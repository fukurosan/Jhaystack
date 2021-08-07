import Document from "./Document"
import IIndexTokenMeta from "../indexing/IIndexTokenMeta"

export default interface IIndexDocument {
	document: Document
	tokenMap: Map<string, IIndexTokenMeta>
	vector: number[]
}
