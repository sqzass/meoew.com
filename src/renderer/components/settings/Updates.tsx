/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Heading, Paragraph, TextButton } from "@vencord/types/components";
import { Margins } from "@vencord/types/utils";
import { Modal, openModal, Toasts, useState } from "@vencord/types/webpack/common";

import { cl, SettingsComponent } from "./Settings";

export const UpdatesButtons: SettingsComponent = () => {
    const [checkingMod, setCheckingMod] = useState(false);
    const usingCustomVencordDir = VesktopNative.fileManager.isUsingCustomVencordDir();

    function openAppUpdater() {
        return VesktopNative.app.openUpdater();
    }

    async function checkForVencordUpdate() {
        setCheckingMod(true);
        try {
            const { updated, version } = await VesktopNative.app.updateVencord();
            if (!updated) {
                Toasts.show({
                    message: `doiksub is up to date (${version})`,
                    id: Toasts.genId(),
                    type: Toasts.Type.SUCCESS
                });
                return;
            }

            openModal(props => (
                <Modal {...props} size="sm" title="doiksub Updated">
                    <div style={{ padding: "1em" }}>
                        <Paragraph>Updated doiksub to {version}. Restart to apply.</Paragraph>
                        <div className={cl("button-grid")} style={{ marginTop: "1em" }}>
                            <TextButton onClick={props.onClose}>Later</TextButton>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    props.onClose();
                                    VesktopNative.app.relaunch();
                                }}
                            >
                                Restart Now
                            </Button>
                        </div>
                    </div>
                </Modal>
            ));
        } catch (err) {
            Toasts.show({
                message: `Failed to check for doiksub updates: ${String(err)}`,
                id: Toasts.genId(),
                type: Toasts.Type.FAILURE
            });
        } finally {
            setCheckingMod(false);
        }
    }

    return (
        <>
            <Heading tag="h5" className={Margins.bottom8}>
                Meoew.com v{VesktopNative.app.getVersion()}
            </Heading>
            <div className={cl("button-grid")}>
                <Button onClick={openAppUpdater}>Check for App Updates</Button>
                <Button disabled={checkingMod || usingCustomVencordDir} onClick={checkForVencordUpdate}>
                    {checkingMod ? "Checking..." : usingCustomVencordDir ? "Using custom doiksub location" : "Check for doiksub Updates"}
                </Button>
            </div>
            {usingCustomVencordDir && (
                <Paragraph className={Margins.top8}>
                    Updates are disabled because you use a custom doiksub folder.
                </Paragraph>
            )}
        </>
    );
};
