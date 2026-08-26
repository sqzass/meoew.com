/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { onceReady } from "@vencord/types/webpack";

import { Settings } from "./settings";
import { VesktopLogger } from "./logger";

export const DEFAULT_ACCENT_COLOR = "#3a0000ff";

const STYLE_ID = "meoew-theme-style";

export interface MeoewTheme {
    enabled?: boolean;
    accentColor?: string;
    statusGlow?: boolean;
    declutter?: boolean;
    gradient?: boolean;
    gradientColor?: string;
}

function getTheme() {
    const t = Settings.store.theme;
    return {
        enabled: t?.enabled ?? true,
        accentColor: t?.accentColor || DEFAULT_ACCENT_COLOR,
        statusGlow: t?.statusGlow ?? true,
        declutter: t?.declutter ?? true,
        gradient: t?.gradient ?? true,
        gradientColor: t?.gradientColor || ""
    };
}

// https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
export function hslToHex(hue: number, saturation: number, lightness: number): string {
    const s = saturation / 100;
    const l = lightness / 100;
    const k = (n: number) => (n + hue / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) =>
        Math.round(255 * x)
            .toString(16)
            .padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** the default top stop of the gradient: the accent hue, dragged down to a deep shade */
export function deriveGradientStop(accent: string): string {
    const { hue, saturation } = hexToHSL(accent);
    return hslToHex(hue, saturation, 13);
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
// adapted from doiksub's clientTheme plugin
export function hexToHSL(hexCode: string) {
    const hex = hexCode.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const cMax = Math.max(r, g, b);
    const cMin = Math.min(r, g, b);
    const delta = cMax - cMin;

    let hue: number;
    let saturation: number;
    const lightness = (cMax + cMin) / 2;

    if (delta === 0) {
        hue = 0;
        saturation = 0;
    } else {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));

        if (cMax === r) hue = ((g - b) / delta) % 6;
        else if (cMax === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;

        hue *= 60;
        if (hue < 0) hue += 360;
    }

    return { hue, saturation: saturation * 100, lightness: lightness * 100 };
}

const NEUTRAL_VARS_REGEX = /(--neutral-\d{1,3}?-hsl):.+?([\d.]+?)%;/g;

let neutralLightnessCache: Record<string, number> | null = null;

async function getDiscordNeutralLightness(): Promise<Record<string, number>> {
    if (neutralLightnessCache) return neutralLightnessCache;

    const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
    const texts = await Promise.all(
        links.map(node =>
            node.href
                ? fetch(node.href)
                    .then(res => res.text())
                    .catch(() => null)
                : Promise.resolve(null)
        )
    );

    const map: Record<string, number> = {};
    for (const text of texts.filter((t): t is string => !!t)) {
        for (const [, name, lightness] of text.matchAll(NEUTRAL_VARS_REGEX)) {
            map[name] = parseFloat(lightness);
        }
    }

    neutralLightnessCache = map;
    return map;
}

function generateNeutralOverrides(lightnessMap: Record<string, number>, hsl: ReturnType<typeof hexToHSL>) {
    const rules = Object.entries(lightnessMap)
        .map(
            ([name, lightness]) =>
                `${name}: ${hsl.hue.toFixed(2)} ${hsl.saturation.toFixed(2)}% ${lightness.toFixed(2)}%;`
        )
        .join("\n");

    return `.theme-dark,\n.theme-light {\n${rules}\n}\n`;
}

export function buildThemeCss(theme: MeoewTheme): string {
    const { accentColor: accent } = theme;
    const gradientStop = theme.gradientColor || `color-mix(in srgb, ${accent} 28%, #120608)`;
    const appBackground = theme.gradient
        ? `linear-gradient(
        165deg,
        ${gradientStop},
        color-mix(in srgb, ${accent} 12%, #0c0506) 45%,
        color-mix(in srgb, ${accent} 6%, #0a0405)
    )`
        : `color-mix(in srgb, ${accent} 8%, #0b0507)`;

    return /* css */ `

html.meoew-theme {
    --meoew-accent: ${accent};
    --meoew-accent-05: color-mix(in srgb, ${accent} 5%, transparent);
    --meoew-accent-10: color-mix(in srgb, ${accent} 10%, transparent);
    --meoew-accent-20: color-mix(in srgb, ${accent} 20%, transparent);
    --meoew-accent-40: color-mix(in srgb, ${accent} 40%, transparent);
}

html.meoew-theme {
    --brand-05: var(--meoew-accent-05);
    --brand-10: var(--meoew-accent-10);
    --brand-15: var(--meoew-accent-20);
    --brand-30: var(--meoew-accent-40);
    --brand-260: ${accent};
    --brand-360: ${accent};
    --brand-430: ${accent};
    --brand-500: ${accent};
    --brand-560: ${accent};
    --brand-600: ${accent};
    --brand-645: ${accent};
    --brand-700: color-mix(in srgb, ${accent} 80%, black);
    --brand-730: color-mix(in srgb, ${accent} 75%, black);
    --brand-800: color-mix(in srgb, ${accent} 70%, black);
    --bg-brand: ${accent};
    --text-brand: #ffffff;
    --control-brand-foreground: ${accent};
    --button-filled-brand-background: ${accent};
    --button-filled-brand-background-hover: color-mix(in srgb, ${accent} 85%, black);
    --button-filled-brand-text: #ffffff;
    --checkbox-background-checked: ${accent};
    --radio-background-checked: ${accent};
    --switch-background-checked: ${accent};
}

html.meoew-theme [class*="lookFilled"][class*="colorBrand"],
html.meoew-theme [class*="lookFilled"][class*="colorLink"] {
    background-color: var(--meoew-accent);
    color: #fff;
}
html.meoew-theme [class*="lookFilled"][class*="colorBrand"]:hover {
    background-color: color-mix(in srgb, ${accent} 85%, black);
}
html.meoew-theme [class*="lookOutlined"][class*="colorBrand"] {
    border-color: var(--meoew-accent);
    color: var(--meoew-accent);
}
html.meoew-theme [class*="lookLink"][class*="colorLink"],
html.meoew-theme a[class*="anchor"] {
    color: var(--meoew-accent);
}
html.meoew-theme [class*="mention"]:not([class*="channel"]) {
    background-color: var(--meoew-accent-20);
    color: var(--meoew-accent);
}

html.meoew-theme body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background: var(--meoew-accent);
    opacity: 0.04;
    mix-blend-mode: multiply;
}

html.meoew-theme #app-mount {
    background: ${appBackground};
}

html.meoew-glow [class*="status_"] {
    border-radius: 50%;
    box-shadow:
        0 0 4px 1px var(--meoew-accent),
        0 0 10px 2px var(--meoew-accent-40);
}

html.meoew-glow [class*="statusText"] {
    color: var(--meoew-accent) !important;
    text-shadow:
        0 0 4px var(--meoew-accent),
        0 0 9px var(--meoew-accent-40) !important;
}

html.meoew-declutter li:has(a[data-list-item-id$="___nitro"]),
html.meoew-declutter li:has(a[data-list-item-id$="___shop"]),
html.meoew-declutter [data-list-item-id$="___nitro"],
html.meoew-declutter [data-list-item-id$="___shop"],
html.meoew-declutter [aria-label="Discover"],
html.meoew-declutter div[class*="listItem"]:has([aria-label*="Download Apps" i]),
html.meoew-declutter [class*="downloadApps"] {
    display: none !important;
}


html.meoew-declutter form [class*="buttons"] > div:has([aria-label*="Gift" i]) {
    display: none !important;
}

html.meoew-declutter section[class*="panels"] [class*="upsell"],
html.meoew-declutter section[class*="panels"] a[href*="store"] {
    display: none !important;
}
`;
}

let styleEl: HTMLStyleElement | null = null;

async function applyTheme() {
    try {
        const theme = getTheme();

        const root = document.documentElement;
        root.classList.toggle("meoew-theme", theme.enabled);
        root.classList.toggle("meoew-glow", theme.enabled && theme.statusGlow);
        root.classList.toggle("meoew-declutter", theme.enabled && theme.declutter);

        styleEl ??= (() => {
            const el = document.createElement("style");
            el.id = STYLE_ID;
            document.head.appendChild(el);
            return el;
        })();
        document.head.appendChild(styleEl);

        styleEl.textContent = theme.enabled ? buildThemeCss(theme) : "";
        if (!theme.enabled) return;

        const lightnessMap = await getDiscordNeutralLightness();
        if (!Object.keys(lightnessMap).length) return;

        styleEl.textContent =
            buildThemeCss(theme) + "\n" + generateNeutralOverrides(lightnessMap, hexToHSL(theme.accentColor));
    } catch (err) {
        VesktopLogger.error("Failed to apply theme", err);
    }
}

export function initTheme() {
    const start = () => {
        void applyTheme();
        Settings.addGlobalChangeListener((_data, path) => {
            if (path.startsWith("theme")) void applyTheme();
        });
        void onceReady.then(() => {
            void applyTheme();
        });
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            if (!root.classList.contains("meoew-theme")) void applyTheme();
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    };

    if (document.head) start();
    else document.addEventListener("DOMContentLoaded", start, { once: true });
}
