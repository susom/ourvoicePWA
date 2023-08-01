import { useEffect, useState } from 'react';
import { db_project } from '../database/db';

const permissionMap = {
    "camera": "camera",
    "audio": "microphone",
    "geo": "geolocation",
};

const usePermissions = () => {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            const permissions = await db_project.permissions.get(1);
            setPermissions(permissions);
            setLoading(false);
        };
        fetchPermissions();
    }, []);

    const savePermissions = async (updatedPermissions) => {
        setLoading(true);
        await db_project.permissions.put({ id: 1, ...updatedPermissions });
        setPermissions(updatedPermissions);
        setLoading(false);
    };

    const requestPermission = async (name) => {
        const mappedName = permissionMap[name] || name;
        const permissionStatus = await navigator.permissions.query({ name: mappedName });
        const updatedPermissions = { ...permissions, [name]: permissionStatus.state };
        savePermissions(updatedPermissions);
        return permissionStatus.state;
    };

    return [permissions, savePermissions, requestPermission, loading];
};

export default usePermissions;
