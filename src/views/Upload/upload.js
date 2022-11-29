import {useContext, useEffect, useState} from "react";

import { Offline, Online } from 'react-detect-offline';
import {SessionContext} from "../../contexts/Session";

// import "../../assets/css/view_upload.css";


function ViewBox(props){
    const [project,setProject] = useState(null);

    const onClickNavigate = (view) => {
        props.navigate(view);
    };

    return (

            <div className="content upload">
                <div className="container">
                    <p className="instructions_upload"><span className="legend_upload ajaxup">&#8686;</span> <span
                        data-translation-key="instructions_upload">Click purple button to upload all walk data</span>
                    </p>
                    <div className="row table_header">
                        <div className="col-sm-2"><span data-translation-key="date">Date</span></div>
                        <div className="col-sm-2"><span data-translation-key="project">Project</span></div>
                        <div className="col-sm-2"><span data-translation-key="walk_id">ID</span></div>
                        <div className="col-sm-2"><span><img src="img/icon_camera_black.png"/></span></div>
                        <div className="col-sm-2"><span><img src="img/icon_audio_comment_black.png"/></span></div>
                        <div className="col-sm-2"><span data-translation-key="upload_status">Status</span></div>
                    </div>

                    <div className="row" id="list_data">
                        <div className="col-sm-12 upload_table">
                            <div className="row table ">
                                <div className="col-sm-2">1/1/19</div>
                                <div className="col-sm-2">AARP</div>
                                <div className="col-sm-2 walkid">9876</div>
                                <div className="col-sm-2">1</div>
                                <div className="col-sm-2">1</div>
                                <div className="col-sm-2 reset"><a className="resync"></a></div>
                            </div>
                        </div>
                    </div>

                    <div id='progressoverlay'>
                        <h3 data-translation-key="upload_progress">Upload progress</h3>
                        <div id="progressbar">
                            <span></span>
                        </div>
                        <h4><b id="percent_uploaded">0</b>%</h4>
                        <a href="#" id="cancel_upload" data-translation-key="cancel">Cancel</a>
                    </div>
                </div>
            </div>

    )
}

export function Upload({db_walks, db_project, db_logs, Axios, Navigate}){
    const session_context = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : true});
    },[]);

    return (
        <ViewBox navTo="/home"  db={db_walks} Axios={Axios}/>
    )
};
