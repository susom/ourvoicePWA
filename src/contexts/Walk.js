import {createContext, useState} from 'react';

export const WalkContext = createContext({
    data : {},
    setData : () => {}
});

export const WalkContextProvider = ({children}) => {
    const [data, setData] = useState({
         project_id           : ""
        ,user_id              : ""
        ,walk_id              : ""
        ,lang                 : null
        ,photos               : []
        ,geotags              : []
        ,device               : null
    });

    return (
        <WalkContext.Provider value={{data, setData}}>
            {children}
        </WalkContext.Provider>
    );
}