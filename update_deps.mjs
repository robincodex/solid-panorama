import { readdir, readFile, writeFile } from "fs/promises";
import pkg from './package.json' with {type: "json"};
import { existsSync } from "fs";

const packageDirs = await readdir("packages");

for (const packageDir of packageDirs) {
    console.log(`Updating ${packageDir}`);

    const packageJsonPath = `packages/${packageDir}/package.json`;
    if (!existsSync(packageJsonPath)) {
        continue;
    }
    const packageJson = await readFile(packageJsonPath, "utf8").then(JSON.parse);
    if (packageJson.dependencies) {
        for (const dep of Object.keys(packageJson.dependencies)) {
            if (pkg.dependencies[dep] && packageJson.dependencies[dep] !== pkg.dependencies[dep]) {
                packageJson.dependencies[dep] = pkg.dependencies[dep];
                console.log(` - Updated ${dep} to ${pkg.dependencies[dep]}`);
            } else {
                console.log(` - No update for ${dep}`);
            }
        }
    }
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4)+'\n');
}