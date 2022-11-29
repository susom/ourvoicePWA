import {useContext, useEffect, useState} from "react";

import Button from "react-bootstrap/Button";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import {SessionContext} from "../../contexts/Session";

import 'react-html5-camera-photo/build/css/index.css';
// import "../../assets/css/view_walk.css";

/*
    ,initCache : function(){
        app.cache.db_fail_timeout       = null;

        app.cache.online                = false;
        app.cache.positionTrackerId     = null; //ref to setInterval
        app.cache.curmap                = null; //ref to google map
        app.cache.currentWalkMap        = [];   //array of geotags for current walk
        app.cache.history               = ["step_zero"];   //the app usage forward history

        app.cache.next_id               = null; //NEXT USER ID - POUCH COLLATED
        app.cache.participant_id        = null; //JUST SIMPLE INTEGER

        app.cache.audioObj              = {};   //FOR VOICE RECORDINGS
        app.cache.audioStatus           = null;
        app.cache.currentAudio          = null;
        app.cache.playbackTimer         = null;

        app.cache.saveToAlbum           = true;
        app.cache.accuracy_threshold    = 50;
        app.cache.uploadInProgress      = false;
        app.cache.audioPlayer 			= null;
        app.cache.versionCheck			= null;
        app.cache.versionOK             = true;

        app.cache.resumeUploads         = {};

        app.cache.session               = false; //?
        app.cache.reset_active_project  = false;
        app.cache.dynamic_css           = false;
    }

    *app.cache.active_project            = response["active_project"];

                            if(!err){
                                app.cache.active_project["_id"]     = resp["_id"]; //"active_project"
                                app.cache.active_project["_rev"]    = resp["_rev"]; //"need this to push a new save revision
                            }
                            datastore.writeDB(app.cache.localprojdb, app.cache.active_project);

                            *
                            *  datastore.writeDB(app.cache.localusersdb , app.cache.user[app.cache.current_session]);
                            *

                           * app.cache.user[app.cache.current_session].project_id    = app.cache.active_project["code"];
                app.cache.user[app.cache.current_session].lang          = $("select[name='language']").val();
                app.cache.user[app.cache.current_session].user_id       = app.cache.participant_id;
                app.cache.user[app.cache.current_session]._id           = app.cache.next_id; //COLLATED
                app.cache.user[app.cache.current_session].device        = {
                      "cordova"         : device.cordova
                     ,"manufacturer"    : device.manufacturer
                     ,"model"           : device.model
                     ,"platform"        : device.platform
                     ,"version"         : device.version
                };
                *
                * var last4   = app.cache.user[app.cache.current_session]._id.substr(app.cache.user[app.cache.current_session]._id.length - 4);
                *
                * for (var i in app.cache.user[app.cache.current_session]["photos"]){
                    var p_obj = app.cache.user[app.cache.current_session]["photos"][i];

                    if(p_obj.hasOwnProperty("audios")){
                        audio_text_count += p_obj["audios"].length;
                    }
                    if(p_obj.hasOwnProperty("text_comment") && p_obj["text_comment"] != ""){
                        audio_text_count += 1;
                    }
                }
                *
                * app.cache.user[app.cache.current_session].photos[curPhoto].goodbad = app.cache.user[app.cache.current_session].photos[curPhoto].goodbad + value;
                *
                * app.cache.user[app.cache.current_session].photos.push({
                         "audio"    : false
                        ,"geotag"   : null
                        ,"goodbad"  : null
                        ,"name"     : attref
                        ,"tags"     : []
                        ,"audios"   : []
                    });
                    *
                    *
                    * app.cache.current_session                   = session_count;
        app.cache.user[app.cache.current_session]   = {
                                                         "_id"                  : null
                                                        ,"project_id"           : null
                                                        ,"user_id"              : null
                                                        ,"lang"                 : null
                                                        ,"photos"               : []
                                                        ,"geotags"              : []
                                                        ,"survey"               : []
                                                        ,"device"               : null
                                                    };

        app.cache.attachment                        = {
                                                         "_id"                  : null
                                                        ,"project_id"           : null
                                                    };
        app.initCache();
        *
        *
        * var curpos = {
                     "lat"          : curLat
                    ,"lng"          : curLong
                    ,"accuracy"     : acuracy
                    ,"altitude"     : position.coords.altitude
                    ,"heading"      : position.coords.heading
                    ,"speed"        : position.coords.speed
                    ,"timestamp"    : position.timestamp
                };
                *
                * if(app.cache.user[app.cache.current_session].geotags[i+1]["accuracy"] > 30){
                // console.log("no good accuracy 30+: " + app.cache.user[app.cache.current_session].geotags[i+1]["accuracy"]);
                continue;
            }
            *
            *
            * app.cache.user[app.cache.current_session].photos.push({
                         "audio"    : false
                        ,"geotag"   : null
                        ,"goodbad"  : null
                        ,"name"     : attref
                        ,"tags"     : []
                        ,"audios"   : []
                    });

    *
    */

function ExampleComponent () {
    const recorderControls = useAudioRecorder()
    const addAudioElement = (blob) => {
        const url   = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src   = url;
        audio.controls = true;
        document.body.appendChild(audio);
    };

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={(blob) => addAudioElement(blob)}
                recorderControls={recorderControls}
            />
            <button onClick={recorderControls.stopRecording}>Stop recording</button>
        </div>
    )
}

function hasGeo(){
    return !! (navigator.geolocation);
}

function ViewProjectDetails(props){
    const Axios = props.Axios;
    const db    = props.db;

    /*
    ,initCache : function(){
        app.cache.db_fail_timeout       = null;

        app.cache.online                = false;
        app.cache.positionTrackerId     = null; //ref to setInterval
        app.cache.curmap                = null; //ref to google map
        app.cache.currentWalkMap        = [];   //array of geotags for current walk
        app.cache.history               = ["step_zero"];   //the app usage forward history

        app.cache.next_id               = null; //NEXT USER ID - POUCH COLLATED
        app.cache.participant_id        = null; //JUST SIMPLE INTEGER

        app.cache.audioObj              = {};   //FOR VOICE RECORDINGS
        app.cache.audioStatus           = null;
        app.cache.currentAudio          = null;
        app.cache.playbackTimer         = null;

        app.cache.saveToAlbum           = true;
        app.cache.accuracy_threshold    = 50;
        app.cache.uploadInProgress      = false;
        app.cache.audioPlayer 			= null;
        app.cache.versionCheck			= null;
        app.cache.versionOK             = true;

        app.cache.resumeUploads         = {};

        app.cache.session               = false; //?
        app.cache.reset_active_project  = false;
        app.cache.dynamic_css           = false;
    }

    *app.cache.active_project            = response["active_project"];

                            if(!err){
                                app.cache.active_project["_id"]     = resp["_id"]; //"active_project"
                                app.cache.active_project["_rev"]    = resp["_rev"]; //"need this to push a new save revision
                            }
                            datastore.writeDB(app.cache.localprojdb, app.cache.active_project);

                            *
                            *  datastore.writeDB(app.cache.localusersdb , app.cache.user[app.cache.current_session]);
                            *

                           * app.cache.user[app.cache.current_session].project_id    = app.cache.active_project["code"];
                app.cache.user[app.cache.current_session].lang          = $("select[name='language']").val();
                app.cache.user[app.cache.current_session].user_id       = app.cache.participant_id;
                app.cache.user[app.cache.current_session]._id           = app.cache.next_id; //COLLATED
                app.cache.user[app.cache.current_session].device        = {
                      "cordova"         : device.cordova
                     ,"manufacturer"    : device.manufacturer
                     ,"model"           : device.model
                     ,"platform"        : device.platform
                     ,"version"         : device.version
                };
                *
                * var last4   = app.cache.user[app.cache.current_session]._id.substr(app.cache.user[app.cache.current_session]._id.length - 4);
                *
                * for (var i in app.cache.user[app.cache.current_session]["photos"]){
                    var p_obj = app.cache.user[app.cache.current_session]["photos"][i];

                    if(p_obj.hasOwnProperty("audios")){
                        audio_text_count += p_obj["audios"].length;
                    }
                    if(p_obj.hasOwnProperty("text_comment") && p_obj["text_comment"] != ""){
                        audio_text_count += 1;
                    }
                }
                *
                * app.cache.user[app.cache.current_session].photos[curPhoto].goodbad = app.cache.user[app.cache.current_session].photos[curPhoto].goodbad + value;
                *
                * app.cache.user[app.cache.current_session].photos.push({
                         "audio"    : false
                        ,"geotag"   : null
                        ,"goodbad"  : null
                        ,"name"     : attref
                        ,"tags"     : []
                        ,"audios"   : []
                    });
                    *
                    *
                    * app.cache.current_session                   = session_count;
        app.cache.user[app.cache.current_session]   = {
                                                         "_id"                  : null
                                                        ,"project_id"           : null
                                                        ,"user_id"              : null
                                                        ,"lang"                 : null
                                                        ,"photos"               : []
                                                        ,"geotags"              : []
                                                        ,"survey"               : []
                                                        ,"device"               : null
                                                    };

        app.cache.attachment                        = {
                                                         "_id"                  : null
                                                        ,"project_id"           : null
                                                    };
        app.initCache();
        *
        *
        * var curpos = {
                     "lat"          : curLat
                    ,"lng"          : curLong
                    ,"accuracy"     : acuracy
                    ,"altitude"     : position.coords.altitude
                    ,"heading"      : position.coords.heading
                    ,"speed"        : position.coords.speed
                    ,"timestamp"    : position.timestamp
                };
                *
                * if(app.cache.user[app.cache.current_session].geotags[i+1]["accuracy"] > 30){
                // console.log("no good accuracy 30+: " + app.cache.user[app.cache.current_session].geotags[i+1]["accuracy"]);
                continue;
            }
            *
            *
            * app.cache.user[app.cache.current_session].photos.push({
                         "audio"    : false
                        ,"geotag"   : null
                        ,"goodbad"  : null
                        ,"name"     : attref
                        ,"tags"     : []
                        ,"audios"   : []
                    });

    *
    */

    const [pcode, setPcode]     = useState("");
    const [pword, setPword]     = useState("");
    const [pfile, setPfile]     = useState("");
    const [status, setStatus]   = useState("");
    const [walks, setWalks]     = useState([]);

    async function fetchProjectData(){
        try{
            //TODO WTF now, AXIOS DOESNT WORK JUST PASSING BELOW data object with URL
            //from origin 'http://localhost:8080' has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.
            let data = {
                proj_id : 'AAAA',
                proj_pw : '4321'
            };

            //TODO FOR SOME REASON DOING IT LIKE THIS WORKS
            let login_data = new URLSearchParams();
            login_data.append('proj_id', "AAAA");
            login_data.append('proj_pw', "4321");

            Axios.post(
                'https://ourvoice-projects.med.stanford.edu/app_login.php',
                login_data
            )
                .then(function (response) {
                    if(response.status == "200"){
                        //Object.keys(response.data) = ['data', 'status', 'statusText', 'headers', 'config', 'request']
                        //console.log(Object.keys(response.data));
                        let active_project  = response.data["active_project"];
                        let ov_meta         = response.data["ov_meta"]
                        console.log(active_project, ov_meta);
                    }
                })
                .catch(function (error) {
                    console.error(error);
                })

            let version_data = new URLSearchParams();
            version_data.append('version_check', "1");

            Axios.post(
                'https://ourvoice-projects.med.stanford.edu/app_login.php',
                version_data
            )
                .then(function (response) {
                    if(response.status == "200"){
                        // console.log(Object.keys(response.data));
                        let ios     = response.data["ios"];
                        let android = response.data["android"];
                        console.log(`app versions ios ${ios} , android ${android}`);
                    }
                })
                .catch(function (error) {
                    console.error(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    async function addProject() {
        try {
            // Add the new friend!
            const id = await db.walks.add({
                pword,
                pcode
            });

            setStatus(`Project ${pcode} loaded. ${id}`);
            setPcode("");
            setPword("");
        } catch (error) {
            setStatus(`Failed to load ${pcode}: ${error}`);
        }
    }

    const getFile = (files) => {
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
            setPfile(reader.result);
        }
    }

    const deleteWalk = async(id) => {
        console.log(id);
        db.walks.delete(id);
        let allWalks = await db.walks.toArray();
        setWalks(allWalks);
    }

    const getPostInfo = (e) => {
        e.preventDefault();
        if(pcode !== "" && pword !== "" && pfile !==""){
            let walk_data = {
                project_code : pcode,
                project_pw : pword,
                photos : pfile
            }

            console.log("add this to indexdb", walk_data);
            db.walks.add(walk_data).then(async() => {
                let allWalks = await db.walks.toArray();
                setWalks(allWalks);
            });
        }
    };

    useEffect(() => {
        const getWalks = async() => {
            let allWalks = await db.walks.toArray();
            setWalks(allWalks);
        }
        getWalks();
    },[]);

    return (
        <form className="project_details" onSubmit={getPostInfo}>
            <div className="project_login">
                <p>{status}</p>
                <label><span>Project ID</span>
                    <input type="text" onChange={ e => setPcode(e.target.value)} placeholder='Enter Project Code'/>
                </label>
                <label><span>Passcode</span>
                    <input type="password" onChange={ e => setPword(e.target.value)}/>
                </label>
                <label><span>Image Upload or AUDIO!</span>
                    <input type="file" accept="image/*" capture="camera" onChange={e => getFile(e.target.files)}/>
                </label>
            </div>

            <div className="login_submit">
                <Button
                    type="submit"
                    className="project_setup"
                    intent="success"
                    text="Setup project on this device"
                />

                <ul>
                    {walks.map((walk) => {
                        return <li key={walk["id"]}>{walk["project_code"]} / {walk["project_pw"]} : <button onClick={ (e) => deleteWalk(walk["id"]) } >Delete Walk</button><br/> <img src={walk["photos"]} className="photo_thumb"/></li>
                    })}
                </ul>
            </div>
        </form>
    );
}

function ViewBox(props){
    const [project,setProject] = useState(null);
    const [geoData,setGeoData] = useState([{latitude:"...", longitude:"..."}]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(hasGeo()){
                navigator.geolocation.getCurrentPosition(function(position) {
                    //TODO doing it this way, the geodata array always only has initial element??
                    // console.log("geodata doesnt append", geoData.slice());
                    let geo_data_copy = geoData.slice();
                    geo_data_copy.push({latitude : position.coords.latitude, longitude : position.coords.longitude});
                    setGeoData(geo_data_copy);
                    // save to INDEXDB
                    // console.log("5s interval, geolocation.getCurrentPosition()", geo_data_copy);
                });
            }
        }, 5000);
        return () => clearInterval(interval)
    }, []);//run only once, but since interval will keep going

    const onClickNavigate = (view) => {
        props.navigate(view);
    };

    return (
        <div className="content walk" >
            <div>Walks Page Lets do some shet with bootstrap</div>
            <p>Current Geo <br/> latitude:  {geoData[geoData.length-1]["latitude"]} | longitude: {geoData[geoData.length-1]["longitude"]} </p>
        </div>
    )
}
export function Walk(){
    const session_context = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : true});
    },[]);

    return (
        <ViewBox />
    );
};
