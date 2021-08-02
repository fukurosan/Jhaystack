interface ITokenizerResultPositions {
	offsetStart: number
	offsetEnd: number
	position: number
}

export default interface ITokenizerResultMap {
	[key: string]: ITokenizerResultPositions[]
}
