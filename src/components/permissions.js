import { useState, useEffect } from 'react';
import {db_project} from "../database/db";

import {Download, XSquare, Lock, Unlock, Mic, MicMute, MicFill, CameraVideo, CameraVideoFill, CameraVideoOff, GeoAlt, GeoAltFill} from "react-bootstrap-icons";
import {Modal} from "react-bootstrap";

import LoadingSpinner from "./loading_spinner";

import "../assets/css/permissions.css";

function PermissionRequest() {
    const [cameraPermission, setCameraPermission]           = useState(false);
    const [audioPermission, setAudioPermission]             = useState(false);
    const [geolocationPermission, setGeolocationPermission] = useState(false);
    const [show, setShow]                                   = useState(false);

    const [loading, setLoading] = useState({"camera": false, "audio" : false, "geo" : false});
    const PERMISSIONS_ROW_ID = 1;

    useEffect( () => {
        const checkPermissions = async () => {
            const permissions = await db_project.permissions.get(PERMISSIONS_ROW_ID);

            if (permissions) {
                setCameraPermission(permissions.camera);
                setAudioPermission(permissions.audio);
                setGeolocationPermission(permissions.geo);
            }

            if(!permissions || (!permissions.camera || !permissions.geo)){
                handleToggle();
            }
        };
        checkPermissions();
    }, []);

    const updateLoading = (key, value) => {
        console.log(key, value);
        setLoading((prevLoading) => ({
            ...prevLoading,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (loading.camera) {
            requestCameraPermission();
        }
        if (loading.audio) {
            requestAudioPermission();
        }
        if (loading.geo) {
            requestGeolocationPermission();
        }
    }, [loading.camera, loading.audio, loading.geo]);

    async function setPermissions(camera, audio, geo) {
        await db_project.permissions.put({ id: PERMISSIONS_ROW_ID, camera, audio, geo });

        if(camera && audio && geo){
            handleToggle();
        }
    }

    const handleToggle = () => setShow(!show);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCameraPermission(true);
            updateLoading("camera", false);
            setPermissions(true, audioPermission, geolocationPermission)
        } catch (error) {
            console.log("camera denied");
            setCameraPermission(false);
            updateLoading("camera", false);
        }
    };

    const requestAudioPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setAudioPermission(true);
            updateLoading("audio", false);
            setPermissions(cameraPermission, true, geolocationPermission);
        } catch (error) {
            console.log("audio denied");
            setAudioPermission(false);
            updateLoading("audio", false);
        }
    };

    const requestGeolocationPermission = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    setGeolocationPermission(true);
                    updateLoading("geo", false);
                    setPermissions(cameraPermission, audioPermission, true);
                }, () => {
                    console.log("geo unavailable");
                    setGeolocationPermission(false);
                    updateLoading("geo", false);
                },
            );
        } else {
            console.log("geo unavailable");
            setGeolocationPermission(false);
            updateLoading("geo", false);
        }
    };

    return (
        <>
            <Modal show={show} >
                <Modal.Header>
                    <Modal.Title>Device Permissions</Modal.Title>
                    <XSquare className={`modal_close_x_btn`} onClick={handleToggle}/>
                </Modal.Header>
                <Modal.Body>
                    <p>In order to  use the Discovery Tool, the app must have access to the following device features.  Tap each of the buttons to grant access.  This only needs to be done once.</p>

                    <div className={`permissions`}>
                        <button onClick={() => {updateLoading("camera", true); }} className={`permission_request permission_camera ${cameraPermission ? "granted" : ""}`}>
                            <div className={`icons`}>
                                {
                                    cameraPermission
                                        ? (<CameraVideoFill size={40}/>)
                                        : loading.camera ? (<LoadingSpinner/>) : (<Lock size={40}/>)
                                }
                            </div>
                            Camera Access
                        </button>

                        <button onClick={() => {updateLoading("audio", true); }} className={`permission_request permission_audio ${audioPermission ? "granted" : ""}`}>
                            <div className={`icons`}>
                                {
                                    audioPermission
                                        ? (<MicFill size={40}/>)
                                        : loading.audio ? (<LoadingSpinner/>) : (<Lock size={40}/>)
                                }
                            </div>
                            Audio Access
                        </button>

                        <button onClick={() => {updateLoading("geo", true); }} className={`permission_request permission_geo ${geolocationPermission ? "granted" : ""}`}>
                            <div className={`icons`}>
                                {
                                    geolocationPermission
                                        ? <GeoAltFill size={40}/>
                                        : loading.geo ? (<LoadingSpinner/>) : <Lock size={40}/>
                                }
                            </div>
                            Geolocation Access
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PermissionRequest;
