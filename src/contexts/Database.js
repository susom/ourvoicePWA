import React, {createContext, useState} from 'react';
import {db_walks, db_project, db_logs} from "../database/db";

export const DatabaseContext = createContext({
    data : {},
    setData : () => {}
});

export const DatabaseContextProvider = ({children}) => {
    const [data, setData] = useState({
        walks : db_walks,
        project: db_project,
        logs: db_logs
    });

    return (
        <DatabaseContext.Provider value={{data, setData}}>
            {children}
        </DatabaseContext.Provider>
    );
}