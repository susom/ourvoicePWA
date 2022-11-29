import {useContext, useEffect, useState} from "react";

import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

import {SessionContext} from "../../contexts/Session";
// import "../../assets/css/view_consent.css";

function ViewBox(props){

    let walk_id_vis = props.walkId ? "walk_set" : "";

    return (
        <div className={`consent ${walk_id_vis}`}>
            <div className="view_body">
                {props.children}
            </div>
        </div>
    );
}


export function Consent({Navigate}){
    const [curPage, setCurPage] = useState(0);
    const session_context = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : true});
    },[]);

    const onClickReturnHome = (e) => {
        e.preventDefault();
    };



    let consent_pages   = [];
    consent_pages[0]    = (
        <div className="content consent">
            <ul>
                <li>Welcome</li>
                <li>Use the Discovery Tool to take pictures and explain things in your community that affect healthy living. The Discovery Tool will make a map of your route.</li>
                <li>The information you collect will be stored securely at Stanford University and will only be used for research purposes. It may be published or presented, but your identity will never be shared.</li>
            </ul>
            <Button
                className="btn btn-primary start_walk"
                variant="primary"
                onClick={()=> setCurPage(1)}
            >I understand and agree</Button>
        </div>
    );
    consent_pages[1]    = (
        <div>
            <ul>
                <li>Safety Tips</li>
                <li>Walk with another person, if possible</li>
                <li>Pay attention and avoid dangerous situations</li>
                <li>Do not take pictures of people's faces</li>
                <li>Ask for help if you need it</li>
            </ul>
            <Button
                className="btn btn-primary start_walk"
                variant="primary"
                as={Link} to="/walk"
            >Start</Button>
        </div>
    );

    //if curPage == null then first page, otherwise display second page?
    return (
        <ViewBox navTo="/home" walkId={false} onClickReturnHome={onClickReturnHome} >
            {consent_pages[curPage]}
        </ViewBox>
    );
};
