import React, { useState ,useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';

function GMap(props){
    const coordinates       = props.coordinates;
    const mapContainerStyle = {
        height: "20vh",
        width: "100%"
    };

    const center = coordinates.length > 0
        ? { lat: coordinates[0].lat, lng: coordinates[0].lng }
        : { lat: 0, lng: 0 };


    return (<GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={16}
                >
                {coordinates.map((coordinate, index) => (
                    <Marker key={index} position={coordinate} />
                ))}
                <Polyline path={coordinates} />
            </GoogleMap>);
}
const GMapContainer = ({ coordinates }) => {
    const [apiLoaded, setApiLoaded] = useState(false);

    useEffect(() => {
        console.log("does this fire every time i enter the view?")
        if(window.google){
            setApiLoaded(true);
        }
    },[window.google]);

    return (
        !apiLoaded ? <LoadScript googleMapsApiKey="AIzaSyB7bJMYfQLt_xOhecW4RnHRNhdUCv8zE4M" >
                        <GMap coordinates={coordinates} apiLoaded={apiLoaded}/>
                    </LoadScript>
                  : <div> already got the map? </div>
    );
};

// const GMapContainer = (props) => {
//     const [google,setGoogle] = useState(null);
//
//     const onLoad = (map,maps) => {
//         setGoogle(maps);
//     }
//
//     const mapContainerStyle = {
//         height: "20vh",
//         width: "100%"
//     };
//
//     const center = props.coordinates.length > 0
//         ? { lat: props.coordinates[0].lat, lng: props.coordinates[0].lng }
//         : { lat: 0, lng: 0 };
//
//
//     return (
//         <LoadScript googleMapsApiKey={process.env.REACT_APP_GMAPS_API_KEY}
//                     onLoad={() => console.log("google api loaded")}>
//             {
//                 google ? (<GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             center={center}
//                             zoom={16}
//                             onLoad={onLoad}>{props.children}</GoogleMap>)
//                        : (<div>what the fuck loading</div>)
//             }
//         </LoadScript>
//     );
// }

export default GMapContainer;
