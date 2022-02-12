//import { terser } from "rollup-plugin-terser";

function terser() {
}


export default [
    {
        input: "src/index.js",
        output: [
            {file: 'dist/crs-process-api.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    },
    {
        input: "src/action-systems/data-actions.js",
        output: [
            {file: 'dist/action-systems/data-actions.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    },
    {
        input: "src/action-systems/data-actions.js",
        output: [
            {file: 'dist/action-systems/css-grid-actions.js', format: 'es'}
        ],
        plugins: [
            terser()
        ]
    }
];