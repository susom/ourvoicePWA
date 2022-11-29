import {useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import { collection, getDoc, getDocs, doc, onSnapshot, where, query } from "firebase/firestore";
import {firestore, firebaseAuth} from "../../database/Firebase";
import {signInAnonymously,onAuthStateChanged} from "firebase/auth";

import {DatabaseContext} from "../../contexts/Database";
import {SessionContext} from "../../contexts/Session";

import "../../assets/css/view_home.css";

function ViewLead(){
    return (
        <div className="view_lead">
            <p>Thank you for your interest in the Discovery Tool</p>
            <p>The Discovery Tool is only available for use in approved projects.</p>
            <p>For more information please visit<br/><a href="https://ourvoice.stanford.edu">https://ourvoice.stanford.edu</a></p>
        </div>
    );
}

function ViewProjectDetails(props){
    const db_project            = props.db_project;
    const db_context            = useContext(DatabaseContext);
    const db                    = db_context.data;


    const [pcode, setPcode]     = useState("");
    const [pword, setPword]     = useState("");
    const [status, setStatus]   = useState("");

    //hmm by setting firestore rule to request.auth.uid != null it works whether or not im signed in anonymosly?
    // signInAnonymously(firebaseAuth).then(() => {
    //     console.log('User signed in anonymously');
    // }).catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     if (errorCode === 'auth/operation-not-allowed') {
    //         console.log('Enable anonymous in your firebase console.');
    //     }
    //     console.error(error,errorCode,errorMessage);
    // });

    // console.log("Project Details context", project_deets["project_code"]);
    async function checkLogin(){
        const q = query(collection(firestore, "dev_ov_projects")
            , where("code", "==", pcode)
            , where("project_pass", "==", pword)
        );

        const snapshots = await getDocs(q);

        if(!snapshots.empty && snapshots.size){
            snapshots.forEach((doc) => {
                if (doc.exists() ){
                    const data = doc.data();
                    //MAKE SURE NOT ARCHIVED (can't use in where query above cause firestore cant query for field that is potentially not existing)
                    if(!data.hasOwnProperty("archived")){
                        //doc.metadata //fromCache : false, hasPendingWrites :false
                        //doc.id = pcode
                        //doc.get([field]);
                        setStatus("");
                        props.projectSignInOut(true);

                        console.log(data, data["tags"], doc.get("tags"));

                        const active_project_data = {
                            project_id  : pcode,
                            timestamp : Date.now(),
                            expire_date : doc.get("expire_date"),
                            name : doc.get("name"),
                            languages : doc.get("languages"),
                            custom_take_photo_text : doc.get("custom_take_photo_text"),
                            audio_comments : parseInt(doc.get("audio_comments")),
                            text_comments : parseInt(doc.get("text_comments")),
                            thumbs: parseInt(doc.get("thumbs")),
                            show_project_tags : data.hasOwnProperty("show_project_tags") ? parseInt(doc.get("show_project_tags")) : 0,
                            tags :data.hasOwnProperty("tags") ? doc.get("tags") : [],
                        };
                        /*
                        // * ov_meta
                        */
                        updateActiveProject(active_project_data);
                    }else{
                        setStatus("Invalid Project Id or Project Password");
                        setPword("");
                    }
                }
            });
            // snapshots.metadata //fromCache : false, hasPendingWrites :false
        }else{
            setStatus("Invalid Project Id or Project Password");
            setPword("");
        }

        // USE THIS PATTERN IF NEED TO ONLY PULL NEW SINCE LAST PULL?
        // onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        //     snapshot.forEach((doc) => {
        //         // const source = snapshot.metadata.fromCache ? "local cache" : "server";
        //         // console.log("Data came from " + source);
        //     });
        // });
    }

    async function updateActiveProject(active_project_data) {
        try {
            // const id = await db_project.active_project.add(active_project_data).then(async() => {
            //     const all_project_data = await db_project.active_project.toArray();
            //     console.log("all active project data", all_project_data);
            //     // props.projectSignInOut(true);
            // });
            db_project.active_project.clear();
            const id = await db_project.active_project.add(active_project_data).then(() => {
                setStatus("");
            });
        } catch (error) {
            console.log(`Failed to add ${pcode}: ${error}`);
        }
    }

    const getPostInfo = (e) => {
        e.preventDefault();

        if(pcode !== "" && pword !== ""){
            let active_project_data = {
                project_id : pcode,
                project_pw : pword,
                project_meta : ["butthead", "beavis"],
                timestamp : Date.now()
            }

            //TODO i dont want to save the passcode right, Also if there is an active project I should just auto log it in if < 24 hours
            //TODO IF there is an active project > 24 hours, i should check if online and then refresh it anyway
            const active_project = db_project.active_project.where({project_id: pcode}).first();

            active_project.then( function(project_data) {
                // Post my cars to the server:
                const date_diff     = project_data ? Date.now() - project_data["timestamp"]  : 0;
                const diff_hours    = 25;//Math.round(date_diff/(60 * 1000 * 60));




                if(date_diff && diff_hours <= 24){
                    console.log("there is an active project! last updated ", diff_hours , " ago");
                }else{
                    console.log("there is no active project or the 24 hour period has expired, so check against server IF OFFLINE");
                    if(navigator.onLine){
                        //TODO if online pull new copy, if offline continue using the stale one for now until next refresh.
                        //TODO if they leave app open and its > 24 hours... need to log out and make them log back in periodically... poll?

                        checkLogin();
                    }else{
                        //is offline
                        console.log("am offline, fall back to use the stale (24+ hour old) active_project data");
                    }
                }
            }).catch(function(error) {
                // Handle error
                console.log("what error? getPostInfo()", error);
            });
        }
    };

    const pw_or_language = props.signedIn ? (
        <label><span>Language</span>
            <select onChange={ e => console.log("TODO change language") }>
                <option>English</option>
            </select>
        </label>
    ) : (
        <label><span>Passcode</span>
            <input type="password" onChange={ e => setPword(e.target.value)} value={pword} placeholder='eg; 1234'/>
        </label>
    );

    return (
        <form id="signin_project" className="project_setup_form" onSubmit={getPostInfo}>
            <div className="project_login">
                <p className="signin_status">{status}</p>
                <label><span>Project ID</span>
                    <input type="text" className={props.signedIn ? "signedIn" : ""} disabled={props.signedIn ? true : false} onChange={ e => setPcode(e.target.value)} value={pcode} placeholder='eg; ABCD'/>
                </label>
                {pw_or_language}
            </div>
        </form>
    );
}

function Actions(props){
    const onClickNav = props.onClickNav;
    const [clicks, setClicks]   = useState(0);
    const db_context            = useContext(DatabaseContext);
    const db                    = db_context.data;

    const onClickDeleteInc = () => {
        setClicks(clicks+1);
        if(clicks == 8){
            if(window.confirm('All Discovery Tool data saved on this device will be deleted and reset. Click \'Ok\' to proceed.')){
                console.log("truncate followind DB; db_walks, db_project, db_logs, localStorage");

                //TRUNCATE ALL THREE LOCAL INDEXDBs'
                db.walks.table("walks").clear();
                db.project.table("active_project").clear();
                db.logs.table("logs").clear();
                localStorage.clear();

                //RESET UI BY CHANGING SIGN IN /OUT STATE
                props.projectSignInOut(false);
            }

            //RESET CLICK COUNT TO 0
            setClicks(0);
        }
    }

    //DO WE STILL NEED AN "upload page"?
    return props.signedIn ? (
        <div className="home_actions">
            <Button
                className="start_walk"
                variant="primary"
                as={Link} to="/consent"
            >Start</Button>

            <Button
                className="change_project"
                variant="info"
                onClick={ () => props.projectSignInOut(false) }
            >Change Project</Button>

            <Button
                className="upload_data"
                variant="info"
                onClick={onClickNav("/consent")}
            >View/Upload Data</Button>
        </div>
    ) : (
        <div className="home_actions">
            <Button
                form="signin_project"
                type="submit"
                variant="success"
                className="project_setup"
            >Setup project on this device</Button>

            <Button
                variant="warning"
                className="truncate_database"
                onClick={onClickDeleteInc}
            >Truncate Local Database</Button>

        </div>
    );
}

function ViewBox(props){
    const [project,setProject] = useState(null);

    const history = useNavigate();

    const onSignInOut = (flag) => {
        props.setSignedIn(flag);
    }

    const onClickNavigate = (view) => {
        history(view);
    }

    return (
            <div className="content home">
                <ViewLead/>

                <ViewProjectDetails
                    signedIn={props.signedIn}
                    projectSignInOut={onSignInOut}
                />

                <Actions
                    signedIn={props.signedIn}
                    projectSignInOut={onSignInOut}
                    onClickNav = { onClickNavigate }
                />
            </div>
    )
}

export function Home(){
    // useEffect(() => {
    //     //LITERALLY DO NOT NEED THIS SINCE FIREBASE WILL PUSH WHEN ONLINE
    //     onAuthStateChanged(firebaseAuth, (user) => {
    //         if (user) {
    //             // User is signed in, see docs for a list of available properties
    //             // https://firebase.google.com/docs/reference/js/firebase.User
    //             const uid = user.uid;
    //             console.log("user signed in (in this case anon) .", user);
    //         } else {
    //             console.log("user signed out");
    //         }
    //     });
    //
    //     firebaseAuth.signOut().then(() => {
    //         console.log('User signed in anonymously');
    //     }).catch(error => {
    //         if (error.code === 'auth/operation-not-allowed') {
    //             console.log('Enable anonymous in your firebase console.');
    //         }
    //
    //         console.error(error);
    //     });;
    // },[]);

    const session_context = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : true});
    },[]);

    const [signedIn, setSignedIn] = useState(null);

    return (
        <ViewBox signedIn={signedIn} setSignedIn={setSignedIn} />
    )
}