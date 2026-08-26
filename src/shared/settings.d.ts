/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Rectangle } from "electron";

export interface Settings {
    discordBranch: "stable" | "canary" | "ptb";
    transparencyOption: "none" | "mica" | "tabbed" | "acrylic";
    webRTCIPHandlingPolicy:
        | "default"
        | "default_public_interface_only"
        | "default_public_and_private_interfaces"
        | "disable_non_proxied_udp";
    tray: boolean;
    minimizeToTray: boolean;
    autoStartMinimized: boolean;
    openLinksWithElectron: boolean;
    staticTitle: boolean;
    enableMenu: boolean;
    enableShadow: boolean;
    enableRoundedCorners: boolean;
    disableSmoothScroll: boolean;
    hardwareAcceleration: boolean;
    hardwareVideoAcceleration: boolean;
    arRPC: boolean;
    appBadge: boolean;
    enableTaskbarFlashing: boolean;
    disableMinSize: boolean;
    clickTrayToShowHide: boolean;
    nativeTitleBar: boolean;

    enableSplashScreen: boolean;
    splashTheming: boolean;
    splashPixelated: boolean;
    splashColor?: string;
    splashBackground?: string;

    spellCheckLanguages?: string[];

    theme?: {
        /** master switch for the meoew.com look */
        enabled?: boolean;
        /** hex accent color used for the red recolor + status glow */
        accentColor?: string;
        /** red glow around presence/status indicators */
        statusGlow?: boolean;
        /** hide clutter (shop entries, gift button, etc) */
        declutter?: boolean;
        /** blend the accent into darker shades behind the app instead of a flat background */
        gradient?: boolean;
        /** optional custom top color for the gradient; derived from the accent when unset */
        gradientColor?: string;
    };

    /** whether the "new look" prompt has been answered; hides it forever once true */
    themePromptAnswered?: boolean;

    audio?: {
        workaround?: boolean;

        deviceSelect?: boolean;
        granularSelect?: boolean;

        ignoreVirtual?: boolean;
        ignoreDevices?: boolean;
        ignoreInputMedia?: boolean;

        onlySpeakers?: boolean;
        onlyDefaultSpeakers?: boolean;
    };
}

export interface State {
    maximized?: boolean;
    minimized?: boolean;
    windowBounds?: Rectangle;

    firstLaunch?: boolean;

    steamOSLayoutVersion?: number;
    linuxAutoStartEnabled?: boolean;

    vencordDir?: string;
    vencordVersion?: string;

    updater?: {
        ignoredVersion?: string;
        snoozeUntil?: number;
    };
}
