import { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { Offline, Online } from "react-detect-offline";
import { CloudCheckFill, CloudMinusFill } from 'react-bootstrap-icons';
// import { BrowserView, MobileView } from 'react-device-detect';

import { SessionContext } from "../contexts/Session";
import { WalkContext } from "../contexts/Walk";

import "../assets/css/global_header.css";

function GlobalHeader() {
    const location          = useLocation();
    const show_header       = location.pathname !== "/" && location.pathname !== "/home";

    const session_context   = useContext(SessionContext);
    const walk_context      = useContext(WalkContext);

    const project_info      = session_context.data.project_info;
    const walk_info         = walk_context.data;

    const in_session        = project_info.project_id && location.pathname !== "/consent" && location.pathname !== "/upload";

    const project_id        = session_context.previewProjID !== null ? session_context.previewProjID : (project_info.project_id ? project_info.project_id : null);
    const walk_id           = session_context.previewWalkID !== null ? session_context.previewWalkID : (walk_info.walk_id ? walk_info.walk_id : null);

    return !show_header ? ( "" ) : (
        <div className={`view_header ${in_session ? "in_session" : ""}`}>
            <div className="app_title">Discovery Tool™</div>
            <div className="walk_id"><span className={project_id ? "has_data" : ""}><b>Project:</b> {project_id}</span> <span className={walk_id  ? "has_data" : ""}> | <b>Walk Id:</b> {walk_id}</span></div>

            {/*<BrowserView>Hey you on Browser</BrowserView>*/}
            {/*<MobileView>Hey you on Mobile</MobileView>*/}
            <Offline>
                <span className="online_status"><CloudMinusFill color="red" size={20} /> Offline</span>
            </Offline>
            <Online>
                <span className="online_status"><CloudCheckFill color="green" size={20} /> Online</span>
            </Online>
        </div>
    );
}
export default GlobalHeader;