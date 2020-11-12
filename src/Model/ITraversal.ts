import SearchResult from "./SearchResult"
import Item from "./Item"
import IComparison from "./IComparison"

export default interface ITraversal {
	(itemArray: Item[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[]
}
