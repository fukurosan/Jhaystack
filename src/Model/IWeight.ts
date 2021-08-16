export default interface IWeight {
	[0]: (path: (string | number)[], value: any) => boolean
	[1]: number
}
