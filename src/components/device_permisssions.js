import React, { useState, useEffect } from "react";
import usePermissions from './usePermissions';
import PermissionButton from './PermissionButton';

import {Download, XSquare, Lock, Unlock, Mic, MicMute, MicFill, CameraVideo, CameraVideoFill, CameraVideoOff, GeoAlt, GeoAltFill, RefreshCcw} from "react-bootstrap-icons";
import {Modal} from "react-bootstrap";
import LoadingSpinner from "./loading_spinner";

import "../assets/css/permissions.css"; // Importing the CSS file

function PermissionModal({ permissionNames }) {
    return;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [permissions, savePermissions, requestPermission, loading] = usePermissions();
    const loadingPermissions = Object.values(loading).some(v => v);

    const deniedPermissions = permissionNames.filter(permissionName => permissions[permissionName] === "denied");
    const promptPermissions = permissionNames.filter(permissionName => permissions[permissionName] === "prompt");

    const deniedPermissionsString = deniedPermissions.join(', ');

    useEffect(() => {
        if (!loadingPermissions) {
            const isPermissionNotGranted = deniedPermissions.length > 0 || promptPermissions.length > 0;
            setIsOpen(isPermissionNotGranted);
        }
    }, [deniedPermissions, promptPermissions, loadingPermissions]);

    return (
        <Modal
            show={modalIsOpen}
            onHide={() => setIsOpen(false)}
            className="permissions_spotCheck"
        >
            <Modal.Header>
                <Modal.Title>Missing Device Permissions</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {deniedPermissions.length > 0 && (
                    <div>
                        <p>The {deniedPermissionsString} permission(s) have been denied. You can enable it by following these steps:</p>
                        <ul>
                            <li>On Chrome: Menu -> Settings -> Privacy and security -> Site Settings -> [Permission]</li>
                            <li>On Firefox: Menu -> Options -> Privacy & Security -> Permissions -> [Permission] -> Settings</li>
                        </ul>
                    </div>
                )}
                {promptPermissions.length > 0 && (
                    <div className="permissions">
                        {promptPermissions.map(permissionName => (
                            <div key={permissionName}>
                                <p>The {permissionName} permission is needed for this application to function properly.</p>
                                <PermissionButton
                                    permissionName={permissionName}
                                    isGranted={permissions[permissionName] === "granted"}
                                    isLoading={loading[permissionName]}
                                    onGrant={() => requestPermission(permissionName)}
                                    iconGranted={<MicFill size={40}/>}
                                    iconLocked={<Lock size={40}/>}
                                    description={`The app requires use of the ${permissionName} for the feature to work`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default PermissionModal;
