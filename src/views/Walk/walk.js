import {useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';

import WalkStart from "../../components/walk_start";
import PhotoDetail from "../../components/photo_detail";


import "../../assets/css/view_walk.css";
import {SessionContext} from "../../contexts/Session";

function ViewBox(props){
    return (
        <div className={`consent`}>
            {props.children}
        </div>
    );
}

export function Walk(){
    const session_context       = useContext(SessionContext);
    const navigate              = useNavigate();

    const [dataUri, setDataUri] = useState('');

    useEffect(() => {
        if (!session_context.data.project_id) {
            navigate('/home');
        }
    }, [session_context.data.project_id]);

    const handleTakePhoto = (dataUri) => {
        setDataUri(dataUri);
        return false;
    };

    return (
        <ViewBox>
            {
                !dataUri
                    ? <WalkStart handleTakePhoto={handleTakePhoto}/>
                    : <PhotoDetail setDataUri={setDataUri} photo={dataUri}/>
            }
        </ViewBox>
    );
};
