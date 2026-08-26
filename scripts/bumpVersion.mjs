/*
 * meoew.com, the only mod you'll need.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// so much faster than manually finding the files
// may be because im slow, but fuck it we ball

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const pkgPath = join(root, "package.json");
const sitePath = join(root, "site", "index.html");

const arg = process.argv[2];
if (!arg) {
    console.error("[major|minor|patch|<version>]");
    process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const [currentCore, currentSuffix] = pkg.version.split("-");
let newCore;

if (arg === "major" || arg === "minor" || arg === "patch") {
    const parts = currentCore.split(".").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        console.error(`Cannot auto-bump non-semver version "${pkg.version}", pass an explicit version instead.`);
        process.exit(1);
    }
    const idx = { major: 0, minor: 1, patch: 2 }[arg];
    parts[idx]++;
    for (let i = idx + 1; i < parts.length; i++) parts[i] = 0;
    newCore = parts.join(".");
} else {
    if (!/^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(arg)) {
        console.error(`"${arg}" is not a valid version (expected major/minor/patch).`);
        process.exit(1);
    }
    newCore = arg;
}

// keep -alpha suffix cuz im still hashing out basic fucking things
// only removes it on explicit (vX.X.X) versions
const newVersion = arg === "major" || arg === "minor" || arg === "patch"
    ? `${newCore}${currentSuffix ? `-${currentSuffix}` : ""}`
    : arg;

const pkgText = readFileSync(pkgPath, "utf8");
if (!pkgText.includes(`"version": "${pkg.version}"`)) {
    console.error(`chat we are cooked. no package.json found.`);
    process.exit(1);
}
writeFileSync(pkgPath, pkgText.replace(`"version": "${pkg.version}"`, `"version": "${newVersion}"`));

const site = readFileSync(sitePath, "utf8");
if (!site.includes(`v${pkg.version}`)) {
    console.warn(`did you bogos yo binted? website not found.`);
} else {
    writeFileSync(sitePath, site.replace(new RegExp(`v${pkg.version.replace(/\./g, "\\.")}\\b`, "g"), `v${newVersion}`));
} // stop reading this file bro

console.log(`${pkg.version} -> ${newVersion}`);
