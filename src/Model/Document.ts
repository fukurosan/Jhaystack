import Declaration from "./Declaration"

export type DocumentID = number

export default class Document {
	/** Unique Identifier */
	id: DocumentID
	/** The origin object */
	origin: any
	/** The index of the origin object in the origin array */
	originIndex: number
	/** All values found nested inside of the origin object */
	declarations: Declaration[]

	constructor(id: DocumentID, origin: any, originIndex: number, declarations: Declaration[]) {
		this.id = id
		this.origin = origin
		this.originIndex = originIndex
		this.declarations = declarations
	}
}
