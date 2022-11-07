import { emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");
    await ensureDir("./dist/action-systems");
    await ensureDir("./dist/action-systems/managers");
    await ensureDir("./dist/action-systems/managers/dragdrop-manager");
}

async function packageDirectory(def, loader, format, minified) {
    for (const dir of def.dir) {
        for await (const dirEntry of Deno.readDir(dir)) {
            if (dirEntry.isDirectory) {
                continue;
            }

            const sourceFile = `${dir}/${dirEntry.name}`;

            let targetFile = `${def.target}${dir}/${dirEntry.name}`;
            let keys = Object.keys(def.replace || {});
            for (const key of keys) {
                targetFile = targetFile.replace(key, def.replace[key]);
            }

            await packageFile(sourceFile, targetFile, loader, format, minified);
        }
    }
}

async function packageFiles(def, loader, format, minified) {
    for (const file of def.files) {
        const target = file.replace("./src", "./dist");
        await packageFile(file, target, loader, format, minified);
    }
}

async function packageFile(sourceFile, targetFile, loader, format, minified) {
    const src = await Deno.readTextFile(sourceFile);
    const result = await esbuild.transform(src, { loader: loader, minify: minified, format: format });
    await Deno.writeTextFile(targetFile, result.code);
}

async function bundle(file, output, minify = true) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile: output,
        format: "esm",
        minify: minify
    })

    console.log(result);
}


await createFolderStructure();

const minified = true;

await packageDirectory({
    dir: ["./src/action-systems"],
    replace: {
        "./src": ""
    },
    target: "./dist"
}, "js", "esm", minified);

await packageDirectory({
    dir: ["./src/action-systems/managers"],
    replace: {
        "./src": ""
    },
    target: "./dist"
}, "js", "esm", minified);

await packageDirectory({
    dir: ["./src/action-systems/managers/dragdrop-manager"],
    replace: {
        "./src": ""
    },
    target: "./dist"
}, "js", "esm", minified);

await bundle("./src/index.js", "./dist/crs-process-api.js", minified);
Deno.exit(0);
