export default interface ISpelling {
	build: (values: any[]) => void
	evaluate: (value: any) => string | null
}
