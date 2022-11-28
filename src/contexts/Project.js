import React, {createContext, useState} from 'react';

export const ProjectContext = createContext({
    data : {},
    setData : () => {}
});

export const ProjectContextProvider = ({children}) => {
    const [data, setData] = useState({
        project_id : "",
        splash_viewed : false,
        in_walk : false
    });

    return (
        <ProjectContext.Provider value={{data, setData}}>
            {children}
        </ProjectContext.Provider>
    );
}