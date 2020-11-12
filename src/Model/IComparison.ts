import IComparisonResult from "./IComparisonResult"

export default interface IComparison {
	(term: unknown, context: unknown): number | IComparisonResult
}
