import React from "react";
import { Button, Card } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import { useNavigate } from "react-router-dom";

const style = {
    central:{
        textAlign: 'center'
    }
}

export function Landing(){
    const navigate = useNavigate();


    const onClick = () => {
        navigate(`/home`);

    }
    
    return (
        <div>
            <Card >
                <div style={style.central}>
                    <h2>Ourvoice Landing</h2>
                    <Button intent="success" text="Go home" onClick={onClick} />
                </div>
            </Card>
        </div>
    )
}