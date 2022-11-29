import {useState, useContext, useEffect} from "react";
import {Navigate} from "react-router-dom";

import {SessionContext} from "../../contexts/Session";
import "../../assets/css/view_splash.css";

export function Landing(){
    const [redirectNow, setRedirectNow] = useState(false);
    const session_context               = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : false});
    },[]);

    setTimeout(() => {
        setRedirectNow(true);
    }, 3000); //3 secs

    return redirectNow ?
        (
            <Navigate to={{pathname: '/home'}} / >
        )
        :
        (
            <div id="splashScreen">
                <h1>Our Voice Discovery Tool</h1>
            </div>
        );
};
