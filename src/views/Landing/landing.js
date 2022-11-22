import { useState } from "react";
import { Navigate } from "react-router-dom";

export function Landing(){
    const [redirectNow, setRedirectNow] = useState(false);

    setTimeout(() => setRedirectNow(true), 3000); //3 secs

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
