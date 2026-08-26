/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Paragraph, TextButton } from "@vencord/types/components";
import { Margins } from "@vencord/types/utils";
import { onceReady } from "@vencord/types/webpack";
import { Modal, openModal } from "@vencord/types/webpack/common";

import { Settings } from "./settings";
import { DEFAULT_ACCENT_COLOR } from "./theme";

const REMIND_DELAY = 30_000;

let reminder: ReturnType<typeof setTimeout> | null = null;

export function initThemePrompt() {
    void onceReady.then(() => {
        if (!Settings.store.themePromptAnswered) showPrompt();
    });
}

function answer(keep: boolean) {
    Settings.store.themePromptAnswered = true;
    if (!keep) Settings.store.theme = { ...(Settings.store.theme ?? {}), enabled: false };
}

function scheduleReminder() {
    if (reminder) clearTimeout(reminder);
    reminder = setTimeout(showPrompt, REMIND_DELAY);
}

function showPrompt() {
    openModal(props => (
        <Modal {...props} size="sm" title="Welcome to the new look">
            <div style={{ padding: "1em" }}>
                <Paragraph>
                    meoew.com ships with a red theme by default - recolored accents, glowing statuses, and a
                    decluttered layout.
                </Paragraph>
                <Paragraph className={Margins.top8}>
                    You can keep it, revert to Discord's stock look, or customize everything later under Settings, meoew.com,
                    Theming. The accent color defaults to {DEFAULT_ACCENT_COLOR}.
                </Paragraph>

                <div style={{ display: "flex", gap: "0.5em", justifyContent: "flex-end", marginTop: "1.5em" }}>
                    <TextButton
                        onClick={() => {
                            props.onClose();
                            scheduleReminder();
                        }}
                    >
                        Let Me Test (60s)
                    </TextButton>
                    <Button variant="secondary" onClick={() => answer(false)}>
                        Use Default
                    </Button>
                    <Button variant="primary" onClick={() => answer(true)}>
                        Keep
                    </Button>
                </div>
            </div>
        </Modal>
    ));
}
