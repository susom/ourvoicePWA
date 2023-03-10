import {useContext } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

import {deepMerge} from "../components/util";

import {WalkContext} from "../contexts/Walk";

export default function AudioRecorderWithIndexDB(props) {
    const walk_context      = useContext(WalkContext);
    const recorderControls  = useAudioRecorder();

    const addAudioElement   = (blob) => {
        const current_walk  = walk_context.data;
        const current_photo = current_walk.photos.length;
        const current_audio = Object.keys(props.stateAudios).length + 1;

        const audio_name    = "audio_" + current_photo + "_" + current_audio + ".amr";
        const update_obj    = {};
        update_obj[audio_name] = blob;

        console.log("photodetails before" , props.stateAudios, blob);
        const copy_audios   = deepMerge(props.stateAudios, update_obj);

        //SAVE IT TO STATE ONLY IN CASE THEY WANT TO DISCARD
        props.stateSetAudios(copy_audios);
        console.log("photodetails after deepmerge" , update_obj, props.stateAudios);

    };

    return (
        <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
        />
    );
}
