import {useContext} from "react";
import {Offline, Online} from "react-detect-offline";
import {CloudCheckFill, CloudMinusFill} from 'react-bootstrap-icons';

import {ProjectContext} from "../contexts/Project";
import {SessionContext} from "../contexts/Session";

import "../assets/css/global_header.css";

function GlobalHeader() {
    const session_context   = useContext(SessionContext);
    const project_context   = useContext(ProjectContext);

    return !project_context.data.splash_viewed ? ( "" ) : (
        <div className={`view_header ${session_context.data.walk_id ? "in_session" : ""}`}>
            <div className="app_title">Discovery Tool™</div>
            <div className="walk_id"><b>Project:</b> <span>{session_context.data.project_id}</span> | <b>Walk Id:</b> <span>{session_context.data.walk_id}</span></div>

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