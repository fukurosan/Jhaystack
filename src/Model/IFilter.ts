export default interface IFilter {
	(path: (string | number)[], value: any): boolean
}
