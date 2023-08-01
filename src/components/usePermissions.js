import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const usePermissions = () => {
    const initialPermissionsState = {
        camera: "prompt",
        audio: "prompt",
        geo: "prompt",
    };
    const [permissions, setPermissions] = useState(initialPermissionsState);
    const [loading, setLoading] = useState({
        camera: false,
        audio: false,
        geo: false,
    });

    // Get the stored permissions from the local storage.
    const [storedPermissions, setStoredPermissions] = useLocalStorage("permissions", initialPermissionsState);

    const mapPermissionName = (permissionName) => {
        switch (permissionName) {
            case 'camera': return 'camera';
            case 'audio': return 'microphone';
            case 'geo': return 'geolocation';
            default: return null;
        }
    };

    useEffect(() => {
        if (navigator.permissions) {
            Promise.all(
                Object.keys(initialPermissionsState).map(async (permissionName) => {
                    const permissionStatus = await navigator.permissions.query({ name: mapPermissionName(permissionName) });
                    return { [permissionName]: permissionStatus.state };
                })
            ).then(results => {
                const permissionsState = results.reduce((acc, current) => ({ ...acc, ...current }), {});
                setPermissions(permissionsState);
                // If we get any permissions status from the browser, we update our local storage.
                setStoredPermissions(permissionsState);
            });
        }
    }, []);

    const requestPermission = async (permissionName) => {
        setLoading((prevLoading) => ({
            ...prevLoading,
            [permissionName]: true,
        }));

        try {
            switch (permissionName) {
                case 'camera':
                    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoStream.getTracks().forEach(track => track.stop());
                    setPermissions(prevPermissions => ({
                        ...prevPermissions,
                        camera: 'granted',
                    }));
                    break;
                case 'audio':
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioStream.getTracks().forEach(track => track.stop());
                    setPermissions(prevPermissions => ({
                        ...prevPermissions,
                        audio: 'granted',
                    }));
                    break;
                case 'geo':
                    const granted = await new Promise((resolve) => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(() => resolve('granted'), () => resolve('denied'));
                        } else {
                            resolve('denied');
                        }
                    });
                    setPermissions(prevPermissions => ({
                        ...prevPermissions,
                        geo: granted,
                    }));
                    break;
                default:
                    break;
            }
        } catch (error) {
            // Check the error name to determine if the user denied the permission
            if (error.name === 'NotAllowedError') {
                setPermissions(prevPermissions => ({
                    ...prevPermissions,
                    [permissionName]: 'denied',
                }));
            } else {
                // Handle other types of errors (e.g., NotReadableError for hardware issues)
                console.error(`An error occurred while requesting ${permissionName} permission: ${error}`);
            }
        }

        setLoading((prevLoading) => ({
            ...prevLoading,
            [permissionName]: false,
        }));

        // Save the updated permissions state in the local storage.
        setStoredPermissions(permissions);
    };

    // Load the stored permissions from the local storage.
    useEffect(() => {
        setPermissions(storedPermissions);
    }, [storedPermissions]);

    return [permissions, loading, requestPermission];
};

export default usePermissions;
