import {useContext, useState, useEffect} from "react";
import { useNavigate , Link} from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

import {db_walks} from "../../database/db";
import {WalkContext} from "../../contexts/Walk";
import {SessionContext} from "../../contexts/Session";
import {updateContext} from "../../components/util";

import "../../assets/css/view_consent.css";

import pic_walk_with_another from "../../assets/images/pic_walk_with_another.png";
import pic_danger_2 from "../../assets/images/pic_danger_2.png";
import pic_no_faces from "../../assets/images/pic_no_faces.png";
import pic_ask_help from "../../assets/images/pic_ask_help.png";

function ViewBox(props){
    return (
        <div className="consent_wrap">
            {props.children}
        </div>
    );
}

export function Consent({Navigate}){
    const [curPage, setCurPage] = useState(0);
    const session_context       = useContext(SessionContext);
    const walk_context          = useContext(WalkContext);
    const navigate              = useNavigate();

    useEffect(() => {
        if (!session_context.data.project_id) {
            navigate('/home');
        }
    }, [session_context.data.project_id,navigate]);

    const onClickReturnHome = (e) => {
        e.preventDefault();
    };

    const startWalk = (e) => {
        const unique_id         = uuid();
        const walk_start        = Date.now();
        let walk_id             = walk_start.toString();
        walk_id                 = walk_id.substring(walk_id.length - 4);
        updateContext(walk_context, {"timestamp" : walk_start, "walk_id" : walk_id, "user_id" : unique_id, "project_id" : session_context.data.project_id});
        updateContext(session_context, {"in_walk" : true});

        //save walk now, in case interrupted
        //after every photo, update the indexDB with new photo data...
        //when finish walk, flag it for service worker to pick it up to push
        const save_walk = async () => {
            try {
                const prom = await db_walks.walks.put(walk_context.data).then(() => {
                    // console.log("Walk in indexDB, id was added automagically", walk_context.data.id);
                });

                return prom;
            } catch (error) {
                console.log(`Failed to put walk id ${walk_id}: ${error}`);
            }
        };
        save_walk();
    }

    let consent_pages   = [];
    consent_pages[0]    = (
        <Container className="content consent">
            <Row id="consent_0" className="panel">
                <Col sm={{span:8, offset:2}} xs={{span:12}} className="content">
                    <Container>
                        <Row>
                            <Col sm={{span:10, offset:1}} xs={{span:10, offset:1}} className="consentbox vertconnect green_man_speech"
                                 data-translation-key="consent_greet">Welcome!
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={{span:10, offset:1}} xs={{span:10, offset:1}} className="consentbox vertconnect"
                                 data-translation-key="consent_info_1">Use the Discovery Tool to take pictures and
                                explain things in your community that affect healthy living. The Discovery Tool will
                                make a map of your route.
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={{span:10, offset:1}} xs={{span:10, offset:1}} className="consentbox"
                                 data-translation-key="consent_info_2">The information you collect will be stored
                                securely at Stanford University and will only be used for research purposes. It may be
                                published or presented, but your identity will never be shared.
                            </Col>
                        </Row>

                        <Row className="buttons">
                            <Col>
                                <Button
                                    className="btn btn-primary start_walk"
                                    variant="primary"
                                    onClick={()=> setCurPage(1)}
                                >I understand and agree</Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
    consent_pages[1]    = (
        <Container className="content consent">
            <Row id="consent_1" className="panel">
                <Col sm={{span:8, offset:2}} xs={{span:12}} className="content">
                    <Container>
                        <Row>
                            <Col sm={{span:10, offset:1}} xs={{span:10, offset:1}} className="consentbox" data-translation-key="saftey_tips">Safety Tips</Col>
                        </Row>

                        <Row className="safteytip">
                            <Col sm={{span:3, offset:1}} xs={{span:3, offset:1}}><span><img alt='' src={pic_walk_with_another}/></span></Col>
                            <Col sm={7} xs={7}><span data-translation-key="saftey_tips_1">Walk with another person, if possible</span>
                            </Col>
                        </Row>

                        <Row className="safteytip">
                            <Col sm={{span:3, offset:1}} xs={{span:3, offset:1}}><span><img alt='' src={pic_danger_2}/></span></Col>
                            <Col sm={7} xs={7}><span data-translation-key="saftey_tips_2">Pay attention and avoid dangerous situations</span>
                            </Col>
                        </Row>

                        <Row className="safteytip">
                            <Col sm={{span:3, offset:1}} xs={{span:3, offset:1}}><span><img alt='' src={pic_no_faces}/></span></Col>
                            <Col sm={7} xs={7}><span data-translation-key="saftey_tips_3">Do not take pictures of people's faces</span>
                            </Col>
                        </Row>

                        <Row className="safteytip">
                            <Col sm={{span:3, offset:1}} xs={{span:3, offset:1}}><span><img alt=''  src={pic_ask_help}/></span></Col>
                            <Col sm={7} xs={7}><span data-translation-key="saftey_tips_4">Ask for help if you need it</span>
                            </Col>
                        </Row>

                        <Row className="buttons">
                            <Col>
                                <Button
                                className="btn btn-primary start_walk"
                                variant="primary"
                                as={Link} to="/walk"
                                onClick={(e)=>{
                                    startWalk(e);
                                }}
                            >Start Walk</Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );

    return (
        <ViewBox navTo="/home" onClickReturnHome={onClickReturnHome} >
            {consent_pages[curPage]}
        </ViewBox>
    );
};
