interface ITokenizerResultPositions {
	field: string
	offsetStart: number
	offsetEnd: number
	position: number
}

export default interface IIndexTokenMeta {
	positions: ITokenizerResultPositions[]
	magnitude: number
}
