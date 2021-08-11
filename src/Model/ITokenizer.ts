import ITokenizerResultMap from "./ITokenizerResult"

export default interface ITokenizer {
	(value: unknown): ITokenizerResultMap
}
