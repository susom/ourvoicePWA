import React, { useState } from 'react';
import usePermissions from './usePermissions';
import PermissionButton from './PermissionButton';

import {Download, XSquare, Lock, Unlock, Mic, MicMute, MicFill, CameraVideo, CameraVideoFill, CameraVideoOff, GeoAlt, GeoAltFill, RefreshCcw} from "react-bootstrap-icons";
import {Modal} from "react-bootstrap";
import LoadingSpinner from "./loading_spinner";

import "../assets/css/permissions.css";

function PermissionRequest() {
    const [permissions, loading, requestPermission] = usePermissions();
    const [modalOpen, setModalOpen] = useState(true);  // new state variable to control the modal's visibility

    const { camera: cameraPermission, audio: audioPermission, geo: geolocationPermission } = permissions;

    const handlePermissionRequest = (permissionName) => {
        console.log(permissionName, permissions[permissionName], permissions);
        if (permissions[permissionName] === 'prompt') {
            requestPermission(permissionName);
        }
    };

    return (
        <Modal show={modalOpen && (cameraPermission !== 'granted' || audioPermission !== 'granted' || geolocationPermission !== 'granted')}>
            <Modal.Header>
                <Modal.Title>The Discovery Tool Device Permissions</Modal.Title>
                {cameraPermission === 'granted' && <XSquare onClick={() => setModalOpen(false)}/>}
            </Modal.Header>
            <Modal.Body>
                <p>The app must have access to the following device features in order to function. Tap each of the buttons to grant access. This only needs to be done once.</p>

                <div className={`permissions`}>
                    <PermissionButton
                        permissionName="camera"
                        isGranted={cameraPermission === 'granted'}
                        isLoading={loading.camera}
                        onGrant={() => handlePermissionRequest("camera")}
                        iconGranted={<CameraVideoFill size={40}/>}
                        iconLocked={<Lock size={40}/>}
                        description="The app requires use of the camera for taking photos of neighborhood features"
                    />

                    <PermissionButton
                        permissionName="audio"
                        isGranted={audioPermission === 'granted'}
                        isLoading={loading.audio}
                        onGrant={() => handlePermissionRequest("audio")}
                        iconGranted={<MicFill size={40}/>}
                        iconLocked={<Lock size={40}/>}
                        description="The app requires use of the microphone for recording observations of neighborhood features"
                    />

                    <PermissionButton
                        permissionName="geo"
                        isGranted={geolocationPermission === 'granted'}
                        isLoading={loading.geo}
                        onGrant={() => handlePermissionRequest("geo")}
                        iconGranted={<GeoAltFill size={40}/>}
                        iconLocked={<Lock size={40}/>}
                        description="The app requires use of the geolocation data for mapping walks around the neighborhood"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default PermissionRequest;
