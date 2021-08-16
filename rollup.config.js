import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
//import typescript from 'rollup-plugin-typescript2'
import pkg from "./package.json"
import { terser } from "rollup-plugin-terser"

const DIST_FOLDER = "dist"
const LIBRARY_NAME = pkg.name
const VERSION = pkg.version
const AUTHOR = pkg.author
const HOMEPAGE = pkg.homepage
const DESCRIPTION = pkg.description
const BANNER = `/** @preserve @license @cc_on
 * ----------------------------------------------------------
 * ${LIBRARY_NAME} version ${VERSION}
 * ${DESCRIPTION}
 * ${HOMEPAGE}
 * Copyright (c) ${new Date().getFullYear()} ${AUTHOR}
 * All Rights Reserved. MIT License
 * https://mit-license.org/
 * ----------------------------------------------------------
 */\n`

export default [
	{
		input: "./src/index.ts",
		output: [
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.cjs.js`,
				format: "cjs",
				banner: BANNER,
				exports: "auto"
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.esm.js`,
				format: "esm",
				banner: BANNER
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.umd.js`,
				format: "umd",
				banner: BANNER,
				name: LIBRARY_NAME,
				globals: {}
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.iife.js`,
				format: "iife",
				banner: BANNER,
				name: LIBRARY_NAME,
				globals: {}
			}
		],
		external: [],
		plugins: [
			resolve({
				extensions: [".ts", ".js"]
			}),
			commonjs(),
			babel({
				exclude: "node_modules/**",
				extensions: [".ts", ".js"],
				babelHelpers: "bundled"
			})
		]
	},
	{
		input: "./src/index.ts",
		output: [
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.cjs.min.js`,
				format: "cjs",
				banner: BANNER,
				exports: "auto"
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.esm.min.js`,
				format: "esm",
				banner: BANNER
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.umd.min.js`,
				format: "umd",
				banner: BANNER,
				name: LIBRARY_NAME,
				globals: {}
			},
			{
				file: `${DIST_FOLDER}/${LIBRARY_NAME}.iife.min.js`,
				format: "iife",
				banner: BANNER,
				name: LIBRARY_NAME,
				globals: {}
			}
		],
		external: [],
		plugins: [
			resolve({
				extensions: [".ts", ".js"]
			}),
			commonjs(),
			babel({
				exclude: "node_modules/**",
				extensions: [".ts", ".js"],
				babelHelpers: "bundled"
			}),
			terser({
				format: {
					comments(node, comment) {
						const text = comment.value
						const type = comment.type
						if (type == "comment2") {
							return /@preserve|@license|@cc_on/i.test(text)
						}
					}
				},
				mangle: {
					keep_fnames: true //This is necessary because of _jhaystack function dependencies for workers
				}
			})
		]
	}
]