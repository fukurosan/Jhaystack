export default interface IFilter {
	[0]: (path: (string | number)[], value: any) => boolean
	[1]: number
}
