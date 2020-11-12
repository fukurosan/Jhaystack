export default interface IFilter {
	[0]: (path: string[], value: any) => boolean
	[1]: number
}
