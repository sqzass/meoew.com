/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Paragraph } from "@vencord/types/components";
import { Margins, useForceUpdater } from "@vencord/types/utils";

import { Settings } from "../../settings";
import { DEFAULT_ACCENT_COLOR, deriveGradientStop, type MeoewTheme } from "../../theme";
import { cl, type SettingsComponent } from "./Settings";
import { VesktopSettingsSwitch } from "./VesktopSettingsSwitch";

export const ThemeToggles: SettingsComponent = () => {
    const forceUpdate = useForceUpdater();
    const theme: MeoewTheme = Settings.store.theme ?? {};

    function set(patch: Partial<MeoewTheme>) {
        Settings.store.theme = { ...theme, ...patch };
        forceUpdate();
    }

    return (
        <>
            <VesktopSettingsSwitch
                title="Red Theme"
                description="Apply the meoew.com look - red accents, glowing statuses, decluttered layout."
                value={theme.enabled ?? true}
                onChange={v => set({ enabled: v })}
            />
            <VesktopSettingsSwitch
                title="Glowing Statuses"
                description="Make presence indicators glow with the accent color."
                disabled={!(theme.enabled ?? true)}
                value={theme.statusGlow ?? true}
                onChange={v => set({ statusGlow: v })}
            />
            <VesktopSettingsSwitch
                title="Decluttered Layout"
                description="Hide shop entries, the gift button, download prompts and nitro upsells."
                disabled={!(theme.enabled ?? true)}
                value={theme.declutter ?? true}
                onChange={v => set({ declutter: v })}
            />

            <VesktopSettingsSwitch
                title="Gradient Background"
                description="Blend the accent into darker shades behind the app. Turn off for a flat background."
                disabled={!(theme.enabled ?? true)}
                value={theme.gradient ?? true}
                onChange={v => set({ gradient: v })}
            />
            {(theme.gradient ?? true) && (
                <div className={cl("category-content")} style={{ display: "flex", alignItems: "center", gap: "1em" }}>
                    <Paragraph>Gradient highlight</Paragraph>
                    <input
                        type="color"
                        value={theme.gradientColor || deriveGradientStop(theme.accentColor || DEFAULT_ACCENT_COLOR)}
                        onChange={e => set({ gradientColor: e.currentTarget.value })}
                    />
                    <Paragraph>defaults to a darker shade of the accent</Paragraph>
                </div>
            )}

            <div className={cl("category-content")} style={{ display: "flex", alignItems: "center", gap: "1em" }}>
                <Paragraph>Accent color</Paragraph>
                <input
                    type="color"
                    value={theme.accentColor || DEFAULT_ACCENT_COLOR}
                    disabled={!(theme.enabled ?? true)}
                    onChange={e => set({ accentColor: e.currentTarget.value })}
                />
                {!(theme.enabled ?? true) && <Paragraph>Enable the theme to customize it.</Paragraph>}
            </div>
            <Paragraph className={Margins.top8}>
                Tip: if something stops matching after a Discord update, the selectors live in src/renderer/theme.ts.
            </Paragraph>
        </>
    );
};
