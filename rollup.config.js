import { terser } from "rollup-plugin-terser";

// function terser() {
// }

export default [
    {
        input: "src/index.js",
        output: [{file: 'dist/crs-process-api.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/action-actions.js",
        output: [{file: 'dist/action-systems/action-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/array-actions.js",
        output: [{file: 'dist/action-systems/array-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/binding-actions.js",
        output: [{file: 'dist/action-systems/binding-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/component-actions.js",
        output: [{file: 'dist/action-systems/component-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/condition-actions.js",
        output: [{file: 'dist/action-systems/condition-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/console-actions.js",
        output: [{file: 'dist/action-systems/console-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/css-grid-actions.js",
        output: [{file: 'dist/action-systems/css-grid-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/data-actions.js",
        output: [{file: 'dist/action-systems/data-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/database-actions.js",
        output: [{file: 'dist/action-systems/database-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/dom-actions.js",
        output: [{file: 'dist/action-systems/dom-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/events-actions.js",
        output: [{file: 'dist/action-systems/events-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/files-action.js",
        output: [{file: 'dist/action-systems/files-action.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/fs-actions.js",
        output: [{file: 'dist/action-systems/fs-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/local-storage-actions.js",
        output: [{file: 'dist/action-systems/local-storage-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/loop-actions.js",
        output: [{file: 'dist/action-systems/loop-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/math-actions.js",
        output: [{file: 'dist/action-systems/math-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/media-actions.js",
        output: [{file: 'dist/action-systems/media-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/module-actions.js",
        output: [{file: 'dist/action-systems/module-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/object-actions.js",
        output: [{file: 'dist/action-systems/object-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/process-actions.js",
        output: [{file: 'dist/action-systems/process-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/random-actions.js",
        output: [{file: 'dist/action-systems/random-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/rest-services-actions.js",
        output: [{file: 'dist/action-systems/rest-services-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/session-storage-actions.js",
        output: [{file: 'dist/action-systems/session-storage-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/string-actions.js",
        output: [{file: 'dist/action-systems/string-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/system-actions.js",
        output: [{file: 'dist/action-systems/system-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/translations-actions.js",
        output: [{file: 'dist/action-systems/translations-actions.js', format: 'es'}], plugins: [terser()]
    },
    {
        input: "src/action-systems/validate-actions.js",
        output: [{file: 'dist/action-systems/validate-actions.js', format: 'es'}], plugins: [terser()]
    }
];