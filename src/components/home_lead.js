import {useState, useEffect} from "react";

function HomeLead(props){
    const [signedIn, setSignedIn]   = useState(false);

    useEffect(() => {
        setSignedIn(props.signedIn);
    },[props.signedIn]);

    return  signedIn ? (
        <div className="view_lead">
            <h2>Discovery Tool™</h2>
            <p>v 4.0.0</p>
            <cite>© Stanford University 2023</cite>
        </div>
    ) : (
        <div className="view_lead">
            <p>Thank you for your interest in the Discovery Tool</p>
            <p>The Discovery Tool is only available for use in approved projects.</p>
            <p>For more information please visit<br/><a href="https://ourvoice.stanford.edu">https://ourvoice.stanford.edu</a></p>
        </div>
    );
}

export default HomeLead;