import ISpelling from "./ISpelling"

export default interface ISpellingSpecification {
	id: string
	speller: new (id: any, options?: any) => ISpelling
	options?: any
}
