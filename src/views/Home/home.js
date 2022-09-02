import React from "react";
import { Button, Card } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import { useNavigate } from "react-router-dom";

const style = {
    central:{
        textAlign: 'center'
    }
}

export function Home(){
    const navigate = useNavigate();


    const onClick = () => {
        navigate(`/`);

    }

    return (
        <div>
            <Card >
                <div style={style.central}>
                    <h2>Ourvoice Home Page</h2>
                    <Button intent="success" text="Go back" onClick={onClick} />
                </div>
            </Card>
        </div>
    )
}
