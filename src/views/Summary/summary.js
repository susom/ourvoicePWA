import {useContext, useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { Polyline, Marker } from '@react-google-maps/api';
import {Link} from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';

import {db_walks} from "../../database/db";
import GMapContainer from "../../components/google_maps";
import {updateContext, putDb} from "../../components/util";

import {SessionContext} from "../../contexts/Session";
import {WalkmapContext} from "../../contexts/Walkmap";
import {WalkContext} from "../../contexts/Walk";

import "../../assets/css/view_summary.css";

function ViewBox(props){
    const session_context   = useContext(SessionContext);
    const walkmap_context   = useContext(WalkmapContext);
    const walk_context      = useContext(WalkContext);

    const [coordinates,setCoordinates]  = useState([]);
    const [photoCount, setPhotoCount]   = useState(0);
    const [obsCount, setObsCount]       = useState(0);

    useEffect(() => {
        setCoordinates(walk_context.data.geotags);
        setPhotoCount(walk_context.data.photos.length);
        // console.log("walk geo tags", walk_context.data.geotags, coordinates);

        if(walk_context.data.photos.length){
            let fcounts = 0;
            for(let ph_i in walk_context.data.photos){
                let photo   = walk_context.data.photos[ph_i];
                if(photo.hasOwnProperty("text_comment") && photo.text_comment !== ""){
                    setObsCount(obsCount + 1);
                    fcounts++;
                }
                if(photo.hasOwnProperty("audios") && Object.keys(photo.audios).length){
                    setObsCount(obsCount + Object.keys(photo.audios).length);
                    fcounts += Object.keys(photo.audios).length;
                }
            }
            setObsCount(fcounts);
        }
    },[walk_context.data, coordinates, obsCount]);

    const resetWalkHandler = (e) => {
        //reset walkmap data length to 0, concat more next time incase they continue walk;
        walkmap_context.data.length = 0;
        walkmap_context.setData(walkmap_context.data);

        //set walk setting to off
        updateContext(session_context, {"in_walk" : false});

        //set completed = true, to let SW know it can push upload
        updateContext(walk_context, {"complete" : 1});

        putDb(db_walks.walks, walk_context.data);
        walk_context.resetData();
    }

    return (

        <Container className="summary">
            {/*<Row>
                <Col sm={{span:8, offset:2}} xs={{span:10, offset:1}} className="consentbox vertconnect bigpad green_man_speech"
                     data-translation-key="finish_title">Great!
                </Col>
            </Row>*/}

            <Row>
                <Col sm={{span:8, offset:2}} xs={{span:10, offset:1}} className="consentbox vertconnect green_man_speech done_photos" data-translation-key="your_route">Here is Your Route</Col>
            </Row>

            <Row id="walkmap">
                <Col sm={{span:8, offset:2}} xs={{span:10, offset:1}} className="consentbox vertconnect noborå">
                    <GMapContainer coordinates={coordinates}>
                        {coordinates.map((coordinate, index) => (
                            <Marker key={index} position={coordinate} />
                        ))}
                        <Polyline path={coordinates} />
                    </GMapContainer>
                </Col>
            </Row>

            {/*<Row>*/}
            {/*    <Col sm={{span:8, offset:2}} xs={{span:10, offset:1}}  className="consentbox vertconnect"*/}
            {/*         data-translation-key="finish_info_1">From home screen, connect to wifi to upload data.*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row>
                <Col sm={{span:8, offset:2}} xs={{span:8, offset:2}} className="consentbox horizconnect"></Col>
            </Row>

            <Row>
                <Col sm={{span:2, offset:3}} xs={{span:2, offset:1}} className="consentbox vertconnect nocontent"></Col>
                <Col sm={{span:2, offset:0}} xs={{span:2, offset:5}} className="consentbox vertconnect nocontent"></Col>
            </Row>

            <Row sm={{span:6}} xs={{span:6}}>
                <Col sm={{span:4, offset:2}} xs={{span:5, offset:0}} className="consentbox vertconnect mr-0" data-translation-key="took_photos">You
                    took this many photos
                </Col>
                <Col sm={{span:4, offset:0}} xs={{span:5, offset:0}} className="consentbox vertconnect"
                     data-translation-key="made_comments">You made this many comments
                </Col>
            </Row>

            <Row>
                <Col sm={{span:2, offset:1}} xs={{span:5, offset:0}} className="consentbox vertconnect icon camera"></Col>
                <Col sm={{span:2, offset:5}} xs={{span:5, offset:0}} className="consentbox vertconnect icon audiocomment"></Col>
            </Row>

            <Row>
                <Col sm={{span:2, offset:3}} xs={{span:5, offset:0}} className="consentbox  solidbg done_photos" id='photos_took'><b>{photoCount}</b>
                </Col>
                <Col sm={{span:2, offset:0}} xs={{span:5, offset:0}} className="consentbox  solidbg done_audios_text" id='audios_recorded'><b>{obsCount}</b></Col>
            </Row>

            <Row>
                <Col sm={{span:8, offset:2}} xs={{span:10, offset:1}} className="consentbox" data-translation-key="are_you_done">Are you done?</Col>
            </Row>

            <Row className={`btns`}>
                <Col sm={{span:4, offset:2}} xs={{span:5, offset:0}} className={`consentbox`}>
                    <Button
                        id="yesdone"
                        data-next="finish"
                        data-translation-key="yes_done"
                        className="btn btn-primary endwalk"
                        variant="primary"
                        as={Link} to="/home"
                        onClick={(e) => {
                            resetWalkHandler(e);
                        }}
                    >Yes, Return to homescreen</Button>
                </Col>
                <Col sm={{span:4, offset:0}} xs={{span:5}} className={`consentbox`}>
                    <Button
                        id="nocontinue"
                        data-next="step_two"
                        data-translation-key="no_continue"
                        className="btn btn-primary continuewalk"
                        variant="primary"
                        as={Link} to="/walk"
                    >No, I want to continue</Button>
                </Col>
            </Row>
        </Container>
    )
}

export function Summary(){
    const session_context   = useContext(SessionContext);
    const navigate          = useNavigate();

    useEffect(() => {
        if (!session_context.data.in_walk) {
            navigate('/home');
        }
    }, [session_context.data.in_walk, navigate]);

    return (
        <ViewBox />
    )
};


