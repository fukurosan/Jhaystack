import { BY_OBJECT } from "../Extraction/ByObject"
import Document from "../Model/Document"
import IIndexDocument from "../Model/IIndexDocument"
import { stopCharacters } from "../PreProcessing/Scrub"

export const createDocumentFromValue = (value: any): Document => {
	return new Document(-1, value, -1, BY_OBJECT(value)[0])
}

export const createEmptyIndexDocument = (): IIndexDocument => {
	return {
		document: new Document(-1, null, -1, []),
		tokenMap: new Map(),
		vector: []
	}
}

export const removeStopCharacters = (value: string) => {
	return value
		.split("")
		.filter(character => !stopCharacters.has(character))
		.join("")
}
