import {useState,useContext} from "react";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import { Container, Row, Col, Button } from 'react-bootstrap';
import {Link} from "react-router-dom";

import {WalkContext} from "../contexts/Walk";
import {WalkmapContext} from "../contexts/Walkmap";
import {db_walks} from "../database/db";
import {updateContext} from "../components/util";


function WalkStart(props){
    const walk_context      = useContext(WalkContext);
    const walkmap_context   = useContext(WalkmapContext);

    const [takePhoto, setTakePhoto]                 = useState(false);
    const [customPhotoPrompt, setCustomPhotoPrompt] = useState("");

    const takePhotoHandler = (e) => {
        e.preventDefault();
        setTakePhoto(true);
    }

    const doneWalkHandler = (e) => {
        const walk_geos = walk_context.data.geotags.concat(walkmap_context.data);
        updateContext(walk_context, {"geotags" : walk_geos});

        //reset walkmap data length to 0;
        walkmap_context.data.length = 0;
        walkmap_context.setData(walkmap_context.data);

        const update_walk = async () => {
            try {
                const walk_prom  = await db_walks.walks.put(walk_context.data).then(() => {
                    console.log(walk_context.data.id, "walk_context already got an id from og add/put, so re-put the walk_context should update new data");
                });
                return [walk_prom];
            } catch (error) {
                console.log(`Failed to update ${walk_context.data.walk_id}: ${error}`);
            }
        };
        update_walk();
    }

    return (
            (takePhoto) ?
                <Camera onTakePhoto={props.handleTakePhoto} />
           :
                <Container className="content walk walk_start" >
                    <Row id="walk_start" className="panel">
                        <Col className="content">
                            <Container>
                                <Row>
                                    <Col className="custom_takephoto_text">
                                        <h5 className="offset-sm-1 col-sm-10">{customPhotoPrompt}</h5>
                                    </Col>
                                </Row>

                                <Row className="photoaction">
                                    <Col className="actions">
                                        <a href="/#" onClick={takePhotoHandler} className="btn button action daction camera">
                                            <b data-translation-key="take_photo">Take a photo</b>
                                            <b data-translation-key="take_another">Take another photo</b>
                                        </a>
                                    </Col>
                                </Row>

                                <Row className="buttons walk_actions">
                                    <Col>
                                        <Button
                                            className="btn btn-primary endwalk"
                                            variant="primary"
                                            as={Link} to="/summary"
                                            onClick={(e) => {
                                                doneWalkHandler(e);
                                            }}
                                        >Done with my walk</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
    )
}

export default WalkStart;