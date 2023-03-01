import {createContext, useState} from 'react';
import {cloneDeep} from "../components/util";

const { platform, userAgent } = navigator;
const context_init = {
     walk_id    : null
    ,project_id : null
    ,user_id    : null
    ,lang       : "en"
    ,photos     : []
    ,geotags    : []
    ,device     : {"platform" : platform, "userAgent" : userAgent}
    ,timestamp  : null
    ,uploaded   : false
    ,complete   : false
}

export const WalkContext = createContext({
    data : {},
    setData : () => {}
});

export const WalkContextProvider = ({children}) => {
    const clean_obj         = cloneDeep(context_init);
    const [data, setData]   = useState(clean_obj);

    const resetData = () => {
        const clean_obj     = cloneDeep(context_init);
        setData(clean_obj);
    }

    return (
        <WalkContext.Provider value={{data, setData, resetData}}>
            {children}
        </WalkContext.Provider>
    );
}