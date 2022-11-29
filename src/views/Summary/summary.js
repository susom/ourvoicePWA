import {useContext, useEffect, useState} from "react";

import {SessionContext} from "../../contexts/Session";

// import "../../assets/css/view_summary.css";

// Add a document with a generated ID.
// import { addDoc, collection } from "firebase/firestore";
//
// try {
//     const docRef = await addDoc(collection(db, "users"), {
//         first: "Alan",
//         middle: "Mathison",
//         last: "Turing",
//         born: 1912
//     });
//
//     console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//     console.error("Error adding document: ", e);
// }

function ViewBox(props){
    const [project,setProject] = useState(null);

    const onClickNavigate = (view) => {
        props.navigate(view);
    };

    return (

            <div className="content summary">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-sm-offset-2 consentbox vertconnect done_photos"
                             data-translation-key="your_route">Your Route
                        </div>
                    </div>

                    <div id="walkmap" className="row">
                        <div className="col-sm-12 consentbox vertconnect nobor">
                            <div id="google_map"></div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-8 col-sm-offset-2 consentbox" data-translation-key="are_you_done">Are you
                            done?
                        </div>
                    </div>

                    <div className="row buttons">
                        <div className="col-sm-12 col-md-6"><a href="#" id="yesdone" className="button confirm endwalk"
                                                               data-next="finish" data-translation-key="yes_done">Yes, I
                            am done</a></div>
                        <div className="col-sm-12 col-md-6"><a href="#" id="nocontinue"
                                                               className="button confirm continuewalk"
                                                               data-next="step_two" data-translation-key="no_continue">No,
                            I want to continue</a></div>
                    </div>
                </div>
            </div>

    )
}
export function Summary({db_walks, db_project, db_logs, Axios, Navigate}){
    //how to pass session walk id across view loads?
    //context? localStorage?
    const session_context = useContext(SessionContext);
    useEffect(() => {
        session_context.setData({splash_viewed : true});
    },[]);

    return (
        <ViewBox navTo="/home" db={db_walks} Axios={Axios}/>
    )
};
