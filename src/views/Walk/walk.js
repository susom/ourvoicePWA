import {useState} from "react";

import WalkStart from "../../components/walk_start";
import PhotoDetail from "../../components/photo_detail";

import "../../assets/css/view_walk.css";

function ViewBox(props){
    return (
        <div className={`consent`}>
            {props.children}
        </div>
    );
}

export function Walk(){
    const [dataUri, setDataUri] = useState('');

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
