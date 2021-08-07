import IFilter from "../Model/IFilter"
import IPreProcessor from "../Model/IPreProcessor"
import ITokenizer from "../Model/ITokenizer"
import IWeighter from "./Weighting/IWeighter"
import { Index } from "./Index"

export default interface IIndexOptions {
	filters?: IFilter[]
	preProcessors?: IPreProcessor[]
	tokenizer?: ITokenizer
	//https://stackoverflow.com/questions/52555937/how-to-write-a-typescript-function-accepting-a-class-implementing-an-interface-a
	weighter?: new (Index: Index, options: any) => IWeighter
	weighterOptions?: any
	encodeFields?: boolean
}
