export default (value: unknown): unknown => {
	return typeof value === "string" ? value.toUpperCase() : value
}
