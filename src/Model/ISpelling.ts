import IWordMeta from "./IWordMeta"

interface ISpellingBuildOptions {
	[key: string]: any
}

export default interface ISpelling {
	id: string
	build: (values: Map<string, IWordMeta>, options?: ISpellingBuildOptions) => void
	evaluate: (value: string) => string | null
}
