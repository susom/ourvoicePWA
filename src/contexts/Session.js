import {createContext, useState} from 'react';

export const SessionContext = createContext({
    data : {},
    setData : () => {}
});

export const SessionContextProvider = ({children}) => {
    const [data, setData] = useState({
        project_id : "",
        splash_viewed : false,
        in_walk : false,
        current_page : [],
        session_start : null,
        session_end : null
    });

    return (
        <SessionContext.Provider value={{data, setData}}>
            {children}
        </SessionContext.Provider>
    );
}