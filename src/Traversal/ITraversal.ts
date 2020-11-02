import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"
import IComparison from "../Comparison/IComparison"

export default interface ITraversal {
	(itemArray: Item[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[]
}
