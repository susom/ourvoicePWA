import {useContext} from "react";
import { Link } from "react-router-dom";
import {HouseDoor, HouseDoorFill, Search, Files} from 'react-bootstrap-icons';

import {ProjectContext} from "../contexts/Project";
import {SessionContext} from "../contexts/Session";

import "../assets/css/global_footer.css";

function GlobalFooter (){
    //if upload, summary, change project, go home
    const session_context   = useContext(SessionContext);
    const project_context   = useContext(ProjectContext);

    const home_icon         = session_context.data.walk_id ?  <HouseDoor color="#bbb" size={40} /> : <HouseDoorFill color="#eee" size={40} />;
    const home_link         = <Link to={`/home`} className="go_home">{home_icon}</Link>;
    const slide_preview     = <Link to="#" className="slide_preview"><Search color="#bbb" size={18} className="icon_mag" /><Files color="#bbb" size={40} className="icon_files" /> (<span className="num_photos">{session_context.data.photos.length}</span>)</Link>;
    const footer_link       = !project_context.data.in_walk ? slide_preview : home_link;

    return !project_context.data.splash_viewed ? ( "" ) : (
        <div className="view_footer">
            {footer_link}
        </div>
    );
}

export default GlobalFooter;