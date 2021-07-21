import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.js",
    output: [
        {file: 'dist/crs-process-api.js', format: 'es'}
    ],
    plugins: [
        terser()
    ]
};