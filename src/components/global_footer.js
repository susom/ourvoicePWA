import {useContext} from "react";
import { Link } from "react-router-dom";
import {HouseDoor, HouseDoorFill, Search, Files} from 'react-bootstrap-icons';

import {SessionContext} from "../contexts/Session";
import {WalkContext} from "../contexts/Walk";

import "../assets/css/global_footer.css";

function GlobalFooter (){
    //if upload, summary, change project, go home
    const session_context   = useContext(SessionContext);
    const walk_context      = useContext(WalkContext);

    const home_icon         = walk_context.data.walk_id ?  <HouseDoor color="#bbb" size={40} /> : <HouseDoorFill color="#eee" size={40} />;
    const home_link         = <Link to={`/home`} className="go_home">{home_icon}</Link>;
    const slide_preview     = <Link to="#" className="slide_preview"><Search color="#bbb" size={18} className="icon_mag" /><Files color="#bbb" size={40} className="icon_files" /> (<span className="num_photos">{walk_context.data.photos.length}</span>)</Link>;
    const footer_link       = session_context.data.in_walk ? slide_preview : home_link;

    return !session_context.data.splash_viewed ? ( "" ) : (
        <div className="view_footer">
            {footer_link}
        </div>
    );
}

export default GlobalFooter;