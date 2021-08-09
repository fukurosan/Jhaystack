import IComparisonResult from "./IComparisonResult"

export interface IIndexVector {
	vector: number[]
	isUnitLength: boolean
}

export interface IFullTextScoring {
	(vector1: IIndexVector, vector2: IIndexVector): number | IComparisonResult
}
