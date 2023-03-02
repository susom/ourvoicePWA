import {useEffect} from "react";

// import {db_walks, db_project, db_logs} from "../../database/db";
// import {updateContext} from "../../components/util";

import "../../assets/css/view_upload.css";

function ViewBox(props){

    // const onClickNavigate = (view) => {
    //     props.navigate(view);
    // };

    // async function getWalks(){
    //     const q = query(collection(firestore, "ov_walks"));
    //
    //     const snapshots = await getDocs(q);
    //
    //     if(!snapshots.empty && snapshots.size){
    //         let num_photos      = 0;
    //         let num_txt_audio   = 0;
    //         snapshots.forEach((doc) => {
    //             if (doc.exists() ){
    //                 const data = doc.data();
    //                 //MAKE SURE NOT ARCHIVED (can't use in where query above cause firestore cant query for field that is potentially not existing)
    //
    //                 if(data.photos.length){
    //                     data.photos.forEach((photo) => {
    //                         num_txt_audio += Object.keys(photo.audios).length;
    //                         if(photo.text_comment){
    //                             // num_txt_audio++;
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // }

    return (

            <div className="content upload">
                <div className="container">
                    <p className="instructions_upload"><span className="legend_upload ajaxup">&#8686;</span> <span
                        data-translation-key="instructions_upload">Click purple button to upload all walk data</span>
                    </p>
                    <div className="row table_header">
                        <div className="col-sm-2"><span data-translation-key="date">Date</span></div>
                        <div className="col-sm-2"><span data-translation-key="project">Project</span></div>
                        <div className="col-sm-2"><span data-translation-key="walk_id">ID</span></div>
                        <div className="col-sm-2"><span><img alt='' src="img/icon_camera_black.png"/></span></div>
                        <div className="col-sm-2"><span><img alt='' src="img/icon_audio_comment_black.png"/></span></div>
                        <div className="col-sm-2"><span data-translation-key="upload_status">Status</span></div>
                    </div>

                    <div className="row" id="list_data">
                        <div className="col-sm-12 upload_table">
                            <div className="row table ">
                                <div className="col-sm-2">1/1/19</div>
                                <div className="col-sm-2">AARP</div>
                                <div className="col-sm-2 walkid">9876</div>
                                <div className="col-sm-2">1</div>
                                <div className="col-sm-2">1</div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

    )
}

export function Upload({db_walks, db_project, db_logs, Axios, Navigate}){
    useEffect(() => {
        console.log("consent");
    },[]);

    return (
        <ViewBox navTo="/home"/>
    )
};
