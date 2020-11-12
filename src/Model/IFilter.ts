export default interface IFilter {
	(path: string[], value: any): boolean
}
