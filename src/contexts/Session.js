import { createContext, useState } from 'react';
import { cloneDeep } from "../components/util";

const context_init = {
    project_id : "",
    splash_viewed : false,
    in_walk : false,
    signed_in : false,
    project_info : {}
};

export const SessionContext = createContext({
    data : {},
    setData : () => {}
});

export const SessionContextProvider = ({children}) => {
    const clean_obj         = cloneDeep(context_init);
    const [data, setData]                   = useState(clean_obj);
    const [slideOpen, setSlideOpen]         = useState(false);

    const [previewWalk, setPreviewWalk]         = useState(null);
    const [previewPhoto, setPreviewPhoto]       = useState(null);
    const [previewWalkID, setPreviewWalkID]     = useState(null);
    const [previewProjID, setPreviewProjID]     = useState(null);

    const [lastUploadsUpdated, setLastUploadsUpdated] = useState(Date.now());

    // This function can be called to update lastUpdated
    const updateLastUploadsUpdated = () => {
        setLastUploadsUpdated(Date.now());
    };

    const resetData = () => {
        const clean_obj     = cloneDeep(context_init);
        setData(clean_obj);
        setSlideOpen(false);

        setPreviewWalk(null);
        setPreviewPhoto(null);
        setPreviewProjID(null);
        setPreviewWalkID(null);
    }

    return (
        <SessionContext.Provider value={{data, setData, resetData, slideOpen, setSlideOpen, previewPhoto, setPreviewPhoto, previewWalk, setPreviewWalk, previewWalkID, setPreviewWalkID, previewProjID, setPreviewProjID, lastUploadsUpdated, updateLastUploadsUpdated}}>
            {children}
        </SessionContext.Provider>
    );
}