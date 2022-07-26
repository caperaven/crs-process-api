import { ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";

async function determineVersion(beta) {
    const json = JSON.parse(await Deno.readTextFile("./package.json"));
    const parts = json.version.split(".");

    // we are overriding the beta
    if (parts[2].indexOf("-beta") != -1 && beta == true) {
        return json.version;
    }

    // if current version is a beta, remove the beta and release the version
    if (parts[2].indexOf("-beta") == -1) {
        parts[2] = Number(parts[2]) + 1;
    }
    else {
        parts[2] = parts[2].replace("-beta", "");
    }

    const newVersion = parts.join(".");
    json.version = beta == false ? newVersion : `${newVersion}-beta`;
    await Deno.writeTextFile("./package.json", JSON.stringify(json, null, 4));

    return json.version;
}

async function createFolderStructure(version, beta) {
    let folder = `./dist/${version}`;

    await ensureDir(folder);
    await ensureDir(`${folder}/action-systems`);

    return folder;
}

async function copyFilesToVersion(source, target) {
    for await (const dirEntry of Deno.readDir(source)) {
        if (dirEntry.isDirectory) {
            await copyFilesToVersion(`${source}/${dirEntry.name}`, target);
            continue;
        }
        const subFolder = source.replace("./bundle", "");
        const sourceFile = `${source}/${dirEntry.name}`;
        const targetFile = `${target}/${subFolder}/${dirEntry.name}`.replace("//", "/");

        await Deno.copyFile(sourceFile, targetFile);
    }
}

async function removeBetaFolder(version) {
    const folder = `./dist/${version}-beta`;

    try {
        await Deno.remove(folder, { recursive: true });
    }
    catch {
    }
}

const isBeta = Deno.args.indexOf("--beta") != -1
const version = await determineVersion(isBeta);
const target = await createFolderStructure(version, isBeta);

if (isBeta != true) {
    await removeBetaFolder(version);
}

await copyFilesToVersion("./bundle", target);
