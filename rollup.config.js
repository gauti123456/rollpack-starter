import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import html from '@rollup/plugin-html';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		resolve(), // Tells Rollup how to find node_modules
		commonjs(), // Converts CommonJS modules to ES6
		postcss({
			extract: true,
			minimize: true,
			sourceMap: true,
		}),
		html({
			fileName: 'index.html',
			template: ({ files, publicPath }) => {
				const templatePath = path.resolve(__dirname, 'src/template.html');
				const templateContent = require('fs').readFileSync(templatePath, 'utf8');

				const scripts = (files.js || []).map(({ fileName }) => {
					return `<script src="${publicPath}${fileName}"></script>`;
				}).join('\n');
				const styles = (files.css || []).map(({ fileName }) => {
					return `<link rel="stylesheet" href="${publicPath}${fileName}">`;
				}).join('\n');

				// Replace placeholders in the template with the actual scripts and styles
				return templateContent
					.replace('%scripts%', scripts)
					.replace('%styles%', styles);
			},
		}),
		production && terser() // Minify, but only in production
	]
};
