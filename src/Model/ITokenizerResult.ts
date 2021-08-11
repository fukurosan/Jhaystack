interface ITokenizerResultPositions {
    /** Index where the token starts */
    offsetStart: number
    /** Index where the token ends */
    offsetEnd: number
    /** Index of the token among other tokens */
	position: number
}

export default interface ITokenizerResultMap {
    /** Each key is a token */
	[key: string]: ITokenizerResultPositions[]
}
