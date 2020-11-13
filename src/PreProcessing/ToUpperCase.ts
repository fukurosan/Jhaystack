/**
 * Makes strings upper case, and simply passes through other values.
 * @param {unknown} value - The value to be processed
 * @return {number} - Resulting value
 */
export const TO_UPPER_CASE = (value: unknown): unknown => {
	return typeof value === "string" ? value.toUpperCase() : value
}
