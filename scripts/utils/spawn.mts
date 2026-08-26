/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { spawn as spaaawn, SpawnOptions } from "child_process";
import { join } from "path";

const EXT = process.platform === "win32" ? ".cmd" : "";

const OPTS: SpawnOptions = {
    stdio: "inherit",
    // .cmd shims can't be spawned directly since node 18.20+ (CVE-2024-27980) -> EINVAL
    shell: process.platform === "win32"
};

export function spawnNodeModuleBin(bin: string, args: string[]) {
    spaaawn(join("node_modules", ".bin", bin + EXT), args, OPTS);
}
