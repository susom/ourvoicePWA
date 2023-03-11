import {useEffect, useState, useContext} from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { CloudUploadFill, CloudUpload} from 'react-bootstrap-icons';

import {db_files, db_logs, db_project, db_walks} from "../../database/db";
import {SessionContext} from "../../contexts/Session";

import {tsToYmd, updateContext} from "../../components/util";

import "../../assets/css/view_upload.css";
import icon_camera_black from "../../assets/images/icon_camera_black.png";
import icon_audio_comment_black from "../../assets/images/icon_audio_comment_black.png";

function ViewBox(props){
    const session_context = useContext(SessionContext);

    const clearLocal    = () => {
        if(window.confirm('All Discovery Tool data saved on this device will be deleted and reset. Click \'Ok\' to proceed.')){
            //TRUNCATE ALL FOUR LOCAL INDEXDBs'
            db_project.table("active_project").clear();
            db_walks.table("walks").clear();
            db_files.table("files").clear();
            db_logs.table("logs").clear();
            localStorage.clear();

            //RESET UI BY CHANGING SIGN IN /OUT STATE
            updateContext(session_context, {"project_id" : null, "project_info" : {}});
            props.setWalks([]);
        }
    }

    const countAudios   = (photos) => {
        let count = 0;
        for (let i in photos) {
            if (photos[i].hasOwnProperty("audios")) {
                count += Object.keys(photos[i].audios).length;
            }
        }
        return count;
    }

    return (

            <Container className="content upload">
                <Row className={`upload_desc`}>
                    <Col>
                        <p className="instructions_upload">
                            <span data-translation-key="instructions_upload">Data will upload automatically when your device is online. <br/>This app does not need to be open!</span>
                        </p>
                        <span><CloudUploadFill className={`color_success`}/> Data Uploaded</span> <span> | </span> <span><CloudUpload className={`color_pending`}/> Data Pending Upload</span>
                    </Col>
                </Row>

                <Row className={`table_header`}>
                    <Col sm={{span:2}}><span data-translation-key="date">Date</span></Col>
                    <Col sm={{span:2}}><span data-translation-key="project">Project</span></Col>
                    <Col sm={{span:2}}><span data-translation-key="walk_id">ID</span></Col>
                    <Col sm={{span:2}}><span><img alt='' className={`hdr_icon`} src={icon_camera_black}/></span></Col>
                    <Col sm={{span:2}}><span><img alt='' className={`hdr_icon`} src={icon_audio_comment_black}/></span></Col>
                    <Col sm={{span:2}}><span data-translation-key="upload_status">Status</span></Col>
                </Row>

                {props.walks.map(item => (
                    <Row className={`table_row list_data`} key={item.id}>
                        <Col sm={{span:2}}>{tsToYmd(item.timestamp)}</Col>
                        <Col sm={{span:2}}>{item.project_id}</Col>
                        <Col sm={{span:2}} className={`walkid`}>{item.walk_id}</Col>
                        <Col sm={{span:2}}>{item.photos.length}</Col>
                        <Col sm={{span:2}}>{countAudios(item.photos) + (item.text_comment !== "" ? 1 : 0)}</Col>
                        <Col sm={{span:2}}>{item.uploaded ? <CloudUploadFill className={'color_success'}/> : <CloudUpload className={'color_pending'}/>}</Col>
                    </Row>
                ))}

                <Row className={`btn_row`}>
                    <Col>
                        <button className={`btn btn-danger`} onClick={clearLocal}>Delete All Stored Data</button>
                    </Col>
                </Row>
            </Container>

    )
}

export function Upload(){
    const [walks, setWalks] = useState([]);

    useEffect(() => {
        // Query the object store to get the number of records
        const walks_col = db_walks.walks.toCollection();

        walks_col.count().then(count => {
            if (count > 0) {
                walks_col.toArray(( arr_data) => {
                    console.log(count, "walks");
                    setWalks(arr_data);
                });
            }else{
                console.log("no walks in DB");
            }
        }).catch(error => {
            console.error('Error counting walks:', error);
        });
    },[]);

    return (
        <ViewBox walks={walks} setWalks={setWalks}/>
    )
};
