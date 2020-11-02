import FIND_NESTED_OBJECTS from "./FindNestedObjects"
import FIND_OBJECTS from "./FindObjects"
import FIND_VALUES from "./FindValues"
import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"

interface ITraversal {
	(itemArray: Item[], searchValue: any, comparisonStrategy: ((term: unknown, context: unknown) => number)[], limit?: null | number): SearchResult[]
}

export { FIND_NESTED_OBJECTS, FIND_OBJECTS, FIND_VALUES, ITraversal }

export default {
	FIND_NESTED_OBJECTS,
	FIND_OBJECTS,
	FIND_VALUES
}
