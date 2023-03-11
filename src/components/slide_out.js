import {useContext, useState, useEffect} from "react";
import { Button } from 'react-bootstrap';
import  Slider  from 'react-slide-out';
import 'react-slide-out/lib/index.css';

import {SessionContext} from "../contexts/Session";
import {WalkContext} from "../contexts/Walk";
import {db_files} from "../database/db";
import {buildFileArr, shallowMerge} from "./util";

import "../assets/css/slideout.css";
import {Link} from "react-router-dom";

function getFileByName(files, name){
    let file = null;
    if(files.length){
        for(let i in files){
            if(name === files[i].name){
                file = files[i].file;
                break;
            }
        }
    }
    return file;
}

function PhotoList({data}){
    const gotoPhotoPreview = (e) => {
        e.preventDefault();
        //TODO HOW TO DO NAVIGATE TO photo_detail?
        console.log("go to walk preview for photo", e, data.photo_id)
    }

    return (
        <dl>
            <dt className={`img_preview`} onClick={gotoPhotoPreview}><span>{data.photo_id + 1}.</span> {data.img_preview}</dt>
            <dd>{data.vote_good} {data.vote_bad} {data.has_text} {data.has_audios} {data.has_tags}</dd>
        </dl>
    );
}

function SlideOut(props){
    const session_context   = useContext(SessionContext);
    const walk_context      = useContext(WalkContext);
    const walk              = walk_context.data;
    const [walkSumm, setWalkSumm]           = useState([]);
    const [walkAudios, setWalkAudios]       = useState({});
    const [audioPlaying, setAudioPlaying]   = useState(null);

    useEffect(() => {
        if(walk.photos.length){
            const doc_id = walk.project_id + "_" + walk.user_id + "_" + walk.timestamp ;
            prepSummary(doc_id, walk.photos);
        }
    }, );

    async function prepSummary(doc_id, photos){
        // Query the database for records where fileName matches any value in the array
        const files_arr = buildFileArr(doc_id, photos);
        const files     = await db_files.files.where('name').anyOf(files_arr).toArray()

        const summ_preview  = photos.map((photo, index) => {
            //use dexie to get photo + audio
            const photo_name    = doc_id + "_" + photo.name;
            const photo_base64  = getFileByName(files, photo_name);

            for(let audio_i in photo.audios){
                const audio_name        = doc_id + "_" + audio_i;
                const update_obj        = {};
                update_obj[audio_name]  = getFileByName(files, audio_name);
                //oh now shallowMerge works, but not deepMerge?  FML
                const copy_audios       = shallowMerge(walkAudios, update_obj);
                setWalkAudios(copy_audios);
            }

            const img_preview   = <img src={photo_base64} className={`slide_preview`} alt={`preview`}/>;
            const has_audios    = Object.keys(photo.audios).length
                ? Object.keys(photo.audios).map((audio_name, idx) => {
                    return <Button
                                key={idx}
                                className="icon audio"
                                onClick={(e) => {
                                    handleAudio(e, doc_id + "_" + audio_name) }
                            }>{idx + 1 }</Button>
                  })
                : "";

            const vote_type     = session_context.data.project_info.thumbs === 2 ? "smilies" : "thumbs";
            const vote_good     = photo.goodbad === 1 || photo.goodbad === 3 ? <span className={`icon ${vote_type} up`}>smile</span> : "";
            const vote_bad      = photo.goodbad === 2 || photo.goodbad === 3 ? <span className={`icon ${vote_type} down`}>frown</span> : "";
            const has_text      = photo.text_comment !== "" ? <span className={`icon keyboard`} >keyboard</span> : "";
            const has_tags      = photo.hasOwnProperty("tags") && photo.tags.length ? <span className={`icon tags`}>{photo.tags.length}</span> : "";

            return {"photo_id" : index ,"img_preview" : img_preview, "vote_good" : vote_good, "vote_bad" : vote_bad, "has_text": has_text, "has_audios" : has_audios, "has_tags" : has_tags}
        });

        //SAVE IT TO STATE
        setWalkSumm(summ_preview);
    };

    const handleAudio = (e, audio_name) => {
        e.preventDefault();
        if(e.target.classList.contains("playing")){
            //if playing then stop and remove css
            const audio = audioPlaying;
            if(audio){
                e.target.classList.remove('playing');
                audio.pause();
                audio.remove();
            }
            setAudioPlaying(null);
        }else{
            //if not playing then play, and add class "playing"
            if(walkAudios.hasOwnProperty(audio_name)){
                e.target.classList.add('playing');
                const blob  = walkAudios[audio_name];
                const url   = URL.createObjectURL(blob);
                const audio = document.createElement('audio');
                audio.src   = url;
                audio.setAttribute('id', 'temporary_audioplayer');
                audio.addEventListener("ended", () => {
                    e.target.classList.remove('playing');
                }, false);
                audio.play();
                setAudioPlaying(audio);
            }
        }
    }

    const handleClose = () => {
        props.setIsOpen(false);
    }

    return (<Slider
                isOpen={props.isOpen}
                position="right"
                onClose={handleClose}
                onOutsideClick={handleClose}
                size={400}
                duration={500}
            >
                <div className={`slideout`}>
                    <hgroup>
                        <h2>Current Walk Summary</h2>
                        <h4>Project ID : {walk.project_id}  | Walk Id : {walk.walk_id}</h4>
                    </hgroup>
                    {
                        !walkSumm.length
                            ? (<em>No photos in current walk yet</em>)
                            : walkSumm.map((item,idx) => {
                                return (<PhotoList key={idx} data={item}/>)
                            })
                    }
                </div>
            </Slider>)
}

export default SlideOut;