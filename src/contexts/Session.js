import {createContext, useState} from 'react';
import {cloneDeep} from "../components/util";

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
    const [data, setData]   = useState(clean_obj);

    const resetData = () => {
        const clean_obj     = cloneDeep(context_init);
        setData(clean_obj);
    }

    return (
        <SessionContext.Provider value={{data, setData, resetData}}>
            {children}
        </SessionContext.Provider>
    );
}