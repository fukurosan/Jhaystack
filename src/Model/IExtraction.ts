import Declaration from "./Declaration"

export default interface IExtraction {
	(value: any): Declaration[][]
}
