import React, {createContext, useState} from 'react';

export const SessionContext = createContext({
    data : {},
    setData : () => {}
});

export const SessionContextProvider = ({children}) => {
    const [data, setData] = useState({
         project_id           : "AAAA"
        ,user_id              : ""
        ,walk_id              : "4332"
        ,lang                 : null
        ,photos               : []
        ,geotags              : []
        ,device               : null
    });

    return (
        <SessionContext.Provider value={{data, setData}}>
            {children}
        </SessionContext.Provider>
    );
}