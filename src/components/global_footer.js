import {useContext, useState, useEffect} from "react";
import {HouseDoor, HouseDoorFill, Search, Files} from 'react-bootstrap-icons';
import {useLocation, Link} from 'react-router-dom';

import {SessionContext} from "../contexts/Session";
import {WalkContext} from "../contexts/Walk";
import SlideOut from "./slide_out";

import "../assets/css/global_footer.css";

function GlobalFooter (){
    //if upload, summary, change project, go home
    const location              = useLocation();
    const show_footer           = location.pathname !== "/" && location.pathname !== "/home";

    const walk_context          = useContext(WalkContext);
    const session_context       = useContext(SessionContext);

    const [isOpen, setIsOpen]           = useState(false);
    const [photoCount, setPhotoCount]   = useState(0);

    useEffect(()=>{
        if(walk_context.data.photos.length){
            setPhotoCount(walk_context.data.photos.length);
        }
    },[walk_context.data.photos]);

    const home_icon         = walk_context.data.walk_id ?  <HouseDoor color="#bbb" size={40} /> : <HouseDoorFill color="#eee" size={40} />;
    const home_link         = <Link to={`/home`} className="go_home">{home_icon}</Link>;
    const slide_preview     = <Link to="#" className="slide_preview" onClick={(e) => {
                                    e.preventDefault();
                                    setIsOpen(true);
                                }}><Search color="#bbb" size={18} className="icon_mag" /><Files color="#bbb" size={40} className="icon_files" /> (<span className="num_photos">{photoCount}</span>)</Link>;
    const footer_link       = session_context.data.in_walk ? slide_preview : home_link;

    return !show_footer ? ( "" ) : (
        <>
            <div className="view_footer">
                {footer_link}
            </div>
            <SlideOut isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}

export default GlobalFooter;