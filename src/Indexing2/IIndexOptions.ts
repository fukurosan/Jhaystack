import IFilter from "../Model/IFilter"
import IPreProcessor from "../Model/IPreProcessor"
import ITokenizer from "../Model/ITokenizer"
import IRanker from "./Ranking/IRanker"
import { Index } from "./Index"

export default interface IIndexOptions {
	filters?: IFilter[]
	preProcessors?: IPreProcessor[]
	tokenizer?: ITokenizer
	//https://stackoverflow.com/questions/52555937/how-to-write-a-typescript-function-accepting-a-class-implementing-an-interface-a
	ranker?: new (Index: Index, options: any) => IRanker
	rankerOptions?: any
	encodeFields?: boolean
}
