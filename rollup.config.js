import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.js",
    output: [
        {file: 'dist/lib.min.js', format: 'cjs'},
        {file: 'dist/lib.esm.js', format: 'es'}
    ],
    plugins: [
        terser({
            include: [/^.+\.min\.js$/, '*esm*'],
            exclude: ['some*']
        })
    ]
};