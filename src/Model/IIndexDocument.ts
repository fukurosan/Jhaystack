import Document from "./Document"
import IIndexTokenMeta from "../Indexing/IIndexTokenMeta"

export default interface IIndexDocument {
	document: Document
	tokenMap: Map<string, IIndexTokenMeta>
	vector: number[]
}
