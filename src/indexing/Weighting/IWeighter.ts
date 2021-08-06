import IIndexTokenMeta from "../IIndexTokenMeta"

export default interface IWeighter {
	getIDFMagnitude: (term: string) => number
	getTFMagnitude: (tokenMap: Map<string, IIndexTokenMeta>) => Map<string, IIndexTokenMeta>
	getQueryTFMagnitude: (tokenMap: Map<string, IIndexTokenMeta>) => Map<string, IIndexTokenMeta>
	isQueryUnitLength: boolean
	isDocumentUnitLength: boolean
}
