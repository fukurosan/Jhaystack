interface ITokenizerResultPositions {
	field: string
	offsetStart: number
	offsetEnd: number
	position: number
}

export default interface ITokenMeta {
	positions: ITokenizerResultPositions[]
	weightedOccurence: number
	magnitude: number
}
