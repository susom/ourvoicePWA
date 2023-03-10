import {useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import { collection, getDocs, where, query } from "firebase/firestore";
import {firestore} from "../../database/Firebase";
// import {signInAnonymously,onAuthStateChanged} from "firebase/auth";

import {db_walks, db_project, db_files, db_logs} from "../../database/db";
import {updateContext, tsDiffInHours} from "../../components/util";

import {WalkmapContext} from "../../contexts/Walkmap";
import {SessionContext} from "../../contexts/Session";
import {WalkContext} from "../../contexts/Walk";

import AlertModal from "../../components/modal";
import HomeLead from "../../components/home_lead";
import "../../assets/css/view_home.css";

function ViewProjectDetails(props){
    const session_context       = useContext(SessionContext);
    const walk_context          = useContext(WalkContext);
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

    async function checkLogin(){
        const q = query(collection(firestore, "ov_projects")
            , where("code", "==", props.pcode)
            , where("project_pass", "==", props.pword)
        );

        const snapshots = await getDocs(q);
        if(!snapshots.empty && snapshots.size){
            snapshots.forEach((doc) => {
                if (doc.exists() ){
                    const data = doc.data();
                    //MAKE SURE NOT ARCHIVED (can't use in where query above cause firestore cant query for field that is potentially not existing)

                    if(!data.hasOwnProperty("archived")){
                        setStatus("");
                        props.projectSignInOut(true);

                        const active_project_data = {
                            project_id              : props.pcode,
                            audio_comments          : parseInt(doc.get("audio_comments")),
                            custom_take_photo_text  : doc.get("custom_take_photo_text"),
                            expire_date             : doc.get("expire_date"),
                            languages               : doc.get("languages"),
                            name                    : doc.get("name"),
                            project_created         : doc.get("project_created"),
                            project_email           : doc.get("project_email"),
                            show_project_tags       : data.hasOwnProperty("show_project_tags") ? parseInt(doc.get("show_project_tags")) : 0,
                            tags                    : data.hasOwnProperty("tags") ? doc.get("tags") : [],
                            text_comments           : parseInt(doc.get("text_comments")),
                            thumbs                  : parseInt(doc.get("thumbs")),
                            ov_meta                 : null,
                            timestamp               : Date.now()
                        };

                        //TODO GET ov_meta AND PUT IN AP too
                        updateActiveProject(active_project_data);
                    }else{
                        setStatus("Invalid Project Id or Project Password");
                        props.setPword("");
                    }
                }
            });
        }else{
            setStatus("Invalid Project Id or Project Password");

            props.setAlertMessage({"title" : "Pleas try again", "body" : "Wrong Project ID or Passcode", "cancel_txt" : "Close" , "ok_txt" : ""});
            props.setShowModal(true);

            props.setPword("");
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
            db_project.active_project.clear();
            await db_project.active_project.add(active_project_data).then(() => {
                setStatus("");
            });

            props.setPcode(active_project_data.project_id);
            updateContext(session_context, { "project_info" : active_project_data, "project_id" : active_project_data.project_id });
            updateContext(walk_context, {"project_id" : active_project_data.project_id});
        } catch (error) {
            console.log(`Failed to add ${props.pcode}: ${error}`);
        }
    }

    const getPostInfo = (e) => {
        e.preventDefault();

        if(props.pcode !== "" && props.pword !== ""){

            const active_project = db_project.active_project.where({project_id: props.pcode}).first();
            active_project.then( function(project_data) {
                const diff_hours = project_data ? tsDiffInHours(project_data["timestamp"] , Date.now()) : 999;
                if(diff_hours <= 24){
                    setStatus("");
                    props.projectSignInOut(true);
                    updateContext(session_context, {"project_id" : project_data.project_id});
                    updateContext(walk_context, {"project_id" : project_data.project_id});
                    console.log("has active project, so auto login, do i need to set session context?", session_context.data, walk_context.data);
                }else{
                    console.log("there is no active project or the 24 hour period has expired");
                    if(navigator.onLine){
                        console.log("May or May not have active project, but ONLINE so check server for fresh project data", session_context.data);
                        // if online pull new copy, if offline continue using the stale one for now until next refresh.
                        checkLogin();
                    }else{
                        //is offline
                        console.log("May or May not have active project, OFFLINE so auto login", session_context.data);
                    }
                }
            }).catch(function(error) {
                // Handle error
                console.log("IndexDB query error? active_project", error);
            });
        }
    };

    let pw_or_language = props.signedIn  ? (
        <label><span>Language</span>
            <span className="input_field">
                <select onChange={ e => console.log("TODO change language") }>
                    <option>English</option>
                </select>
            </span>
        </label>
    ) : (
        <label><span>Passcode</span>
            <span className="input_field"><input type="password" onChange={ e => props.setPword(e.target.value)} value={props.pword} placeholder='eg; 1234'/></span>
        </label>
    );

    return (
        <form id="signin_project" className="project_setup_form" onSubmit={getPostInfo}>
            <div className="project_login">
                <p className="signin_status">{status}</p>
                <label><span>Project ID</span>
                    <span className="input_field"><input type="text" className={props.signedIn ? "signedIn" : ""} disabled={props.signedIn && session_context.data.project_id !== null ? true : false} onChange={ e => props.setPcode(e.target.value) } value={props.pcode} placeholder='eg; ABCD'/></span>
                </label>
                {pw_or_language}
            </div>
        </form>
    );
}

function Actions(props){
    const session_context       = useContext(SessionContext);
    const walk_context          = useContext(WalkContext);

    const [clicks, setClicks]   = useState(0);

    const onClickDeleteInc = () => {
        setClicks(clicks+1);
        if(clicks === 10){


            if(window.confirm('All Discovery Tool data saved on this device will be deleted and reset. Click \'Ok\' to proceed.')){
                console.log("truncate followind DB; db_walks, db_project, db_logs, localStorage");

                //TRUNCATE ALL THREE LOCAL INDEXDBs'
                db_project.table("active_project").clear();
                db_walks.table("walks").clear();
                db_files.table("files").clear();
                db_logs.table("logs").clear();
                localStorage.clear();

                //RESET UI BY CHANGING SIGN IN /OUT STATE
                updateContext(session_context, {"project_id" : null, "project_info" : {}});
                props.projectSignInOut(false);

                console.log("please let me master contexts goddamn it", session_context.data);
            }
            //RESET CLICK COUNT TO 0
            setClicks(0);
        }
    }

    const startConsent = (e) => {
        //DONT NEED ANYTHING HERE
    }
    const signInProject = (e) => {
        //DONT NEED ANYTHING HERE?
        // console.log("sign in project");
    }

    const changeProject = (e) => {
        props.projectSignInOut(false);
        updateContext(session_context, {"project_id" : null});
        updateContext(walk_context, {"project_id" : null});
        // console.log("change project");
    }

    //DO WE STILL NEED AN "upload page"?
    return props.signedIn  ? (
        <div className="home_actions">
            <Button
                className="start_walk project_setup"
                variant="primary"
                as={Link} to="/consent"
                onClick={(e) => {
                    startConsent(e);
                }}
            >Start Walk</Button>

            <Button
                className="change_project project_setup"
                variant="info"
                onClick={(e) => {
                    changeProject(e);
                }}
                as={Link} to="/home"
            >Change Project</Button>

            <Button
                className="upload_data project_setup"
                variant="info"
                as={Link} to="/upload"
            >View/Upload Data</Button>
        </div>
    ) : (
        <div className="home_actions">
            <Button
                form="signin_project"
                type="submit"
                variant="success"
                className="project_setup"
                onClick={(e) => {
                    signInProject(e);
                }}
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
    const history           = useNavigate();
    const session_context   = useContext(SessionContext);

    const [alertMessage, setAlertMessage]   = useState({});
    const [showModal, setShowModal]         = useState(false);
    const [handleCancel, setHandleCancel]   = useState(() => {
        return () => {
            console.log("default cancel");
            setShowModal(false);
        }  });
    const [handleOK, setHandleOK]           = useState(() => {
        return () => {
            console.log("default cancel");
            setShowModal(false);
        } })
    const onSignInOut = (flag) => {
        props.setSignedIn(flag);
        updateContext(session_context, {"signed_in" : flag});
    }

    const onClickNavigate = (view) => {
        history(view);
    }

    return (
            <div className="content home">
                <HomeLead signedIn={props.signedIn}/>

                <ViewProjectDetails
                    pcode={props.pcode}
                    setPcode={props.setPcode}
                    pword={props.pword}
                    setPword={props.setPword}

                    setAlertMessage={setAlertMessage}
                    setShowModal={setShowModal}
                    setModalCancel={setHandleCancel}
                    setModalOK={setHandleOK}

                    signedIn={props.signedIn}
                    projectSignInOut={onSignInOut}
                />

                <Actions
                    pcode={props.pcode}
                    setPcode={props.setPcode}
                    pword={props.pword}
                    setPword={props.setPword}

                    setAlertMessage={setAlertMessage}
                    setShowModal={setShowModal}
                    setModalCancel={setHandleCancel}
                    setModalOK={setHandleOK}

                    signedIn={props.signedIn}
                    projectSignInOut={onSignInOut}
                    onClickNav = { onClickNavigate }
                />
                <AlertModal show={showModal} handleCancel={handleCancel} handleOK={handleOK} message={alertMessage}/>
            </div>
    )
}

export function Home(){
    const walkmap_context           = useContext(WalkmapContext); //THE API NEEDS TO "warm up" SO KICK IT OFF HERE BUT DONT STORE DATA UNTIL 'in_walk'
    const session_context           = useContext(SessionContext);

    console.log("kick off walkmap to warm up GPS",walkmap_context.data.length);

    const [pcode, setPcode]         = useState("");
    const [pword, setPword]         = useState("");
    const [signedIn, setSignedIn]   = useState(null);

    useEffect(() => {
        //check if there is a recent login to a project and set in session if so
        const active_project_col = db_project.active_project.toCollection();

        // Query the object store to get the number of records
        active_project_col.count().then(count => {
            if (count > 0) {
                const getActiveProject  = async () => {
                    try {
                        const firstRecord = await active_project_col.first();
                        return firstRecord;
                    } catch (error) {
                        console.error('Error getting active project: ', error);
                    }
                }
                const active_project    = getActiveProject();

                active_project.then((ap) => {
                    const diffInHours = tsDiffInHours(ap["timestamp"], Date.now());
                    if(diffInHours<24){
                        // console.log("Project Info in Cache is < 24h, populate Session_context", ap);
                        let session_data = {
                            project_id : ap["project_id"],
                            splash_viewed : true,
                            signed_in : true,
                            project_info : ap
                        };
                        updateContext(session_context, session_data);
                        setPcode(ap["project_id"]);
                        setSignedIn(true);
                    }
                });
            }else{
                // console.log("no active project, need to login");
            }
        }).catch(error => {
            console.error('Error counting records:', error);
        });

        // const get_ov_meta = async () => {
        //     try {
        //         const docref    = doc(collection(firestore, 'ov_meta'));
        //         const colref    = collection(docref, 'app_data');
        //         console.log("what you mean missing permissions", colref);
        //         const snapshots = await getDocs(colref);
        //
        //         if(!snapshots.empty && snapshots.size){
        //             console.log("ov_meta please", snapshots.size);
        //             snapshots.forEach((doc) => {
        //                 if (doc.exists() ){
        //                     const data = doc.data();
        //                     return data;
        //                 }
        //             });
        //         }
        //
        //         return null;
        //     } catch (error) {
        //         console.error('Error getting ov_meta: ', error);
        //     }
        //
        // }
        // const ov_meta = get_ov_meta();
    }, [session_context]);

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

    return (
        <ViewBox signedIn={signedIn} setSignedIn={setSignedIn} pcode={pcode} setPcode={setPcode} pword={pword} setPword={setPword}/>
    )
}