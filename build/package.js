import { emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'

async function createFolderStructure() {
    await ensureDir("./bundle");
    await emptyDir("./bundle");
    await ensureDir("./bundle/action-systems");
}

async function packageDirectory(def, loader, format, minified) {
    for (const dir of def.dir) {
        for await (const dirEntry of Deno.readDir(dir)) {
            if (dirEntry.isDirectory) {
                continue;
            }

            const file = `${dir}/${dirEntry.name}`;
            const src = await Deno.readTextFile(file);
            const result = await esbuild.transform(src, { loader: loader, minify: minified, format: format });

            let path = `${def.target}${dir}/${dirEntry.name}`;
            let replaceKeys = Object.keys(def.targetReplace || {});
            for (const replaceKey of replaceKeys) {
                path = path.replace(replaceKey, def.targetReplace[replaceKey]);
            }

            await Deno.writeTextFile(path, result.code);
        }
    }
}


const jsFiles = {
    "dir": ["./src", "./src/action-systems"],
    "targetReplace": {
        "./src": ""
    },
    "target": "./bundle"
}

await createFolderStructure();
await packageDirectory(jsFiles, "js", "esm", true);
Deno.exit(0);
