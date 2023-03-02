import {createContext, useState, useContext, useEffect} from 'react';
import {SessionContext} from "../contexts/Session";
import {hasGeo} from "../components/util";
export const WalkmapContext = createContext({
    data : {},
    setData : () => {}
});

export const WalkmapContextProvider = ({children}) => {
    const session_context = useContext(SessionContext);
    const [data, setData] = useState([]);

    const updatePosition = () => {
        if(hasGeo()){
            navigator.geolocation.getCurrentPosition((pos) => {
                let same_geo = false;
                if(data.length){
                    const lastpos   = data[data.length - 1] ;
                    same_geo  = pos.coords.latitude === lastpos.lat && pos.coords.longitude === lastpos.lng;
                }

                if(pos.coords.accuracy < 50 && !same_geo){
                    const geo_point = {
                        "accuracy" : pos.coords.accuracy,
                        "altitude" : pos.coords.altitude,
                        "heading" : pos.coords.heading,
                        "lat" : pos.coords.latitude,
                        "lng" : pos.coords.longitude,
                        "speed" : pos.coords.speed,
                        "timestamp" : pos.timestamp,
                    };
                    const data_copy = data;
                    data_copy.push(geo_point);
                    setData(data_copy);
                }
            }, (err) => {
                console.log(err);
            });
        }else{
            console.log("geodata api not available");
        }
    };

    useEffect(() => {
        const interval = setInterval(() =>{
            if(session_context.data.in_walk){
                updatePosition();
            }
        }, 5000);

        //when unmounted will clear it
        return () => clearInterval(interval);

        // const interval = navigator.geolocation.watchPosition(
        // function(position){
        //     var acuracy = position.coords.accuracy;
        //     var curLat  = position.coords.latitude;
        //     var curLong = position.coords.longitude;
        //
        //     var curpos = {
        //          "lat"          : curLat
        //         ,"lng"          : curLong
        //         ,"accuracy"     : acuracy
        //         ,"altitude"     : position.coords.altitude
        //         ,"heading"      : position.coords.heading
        //         ,"speed"        : position.coords.speed
        //         ,"timestamp"    : position.timestamp
        //     };
        //
        //     if(session_context.data.in_walk && acuracy <= 50){
        //         // if(curLat != prvLat && curLong != prvLong){
        //         //     app.cache.user[app.cache.current_session].geotags.push(curpos);
        //
        //         const data_copy = data;
        //         data_copy.push(curpos);
        //         setData(data_copy);
        //         console.log("what the fuck now, setData not updateng?" , data, data_copy);
        //
        //             // //SAVE THE POINTS IN GOOGLE FORMAT
        //             // if(utils.checkConnection()){
        //             //     var current_goog_lat = new google.maps.LatLng(curLat, curLong);
        //             //     app.cache.currentWalkMap.push(
        //             //         current_goog_lat
        //             //     );
        //             // }
        //         // }
        //     }
        // }
        // ,function(err){
        //     console.log(err);
        // }
        // ,{
        //      enableHighAccuracy: true
        //     ,maximumAge        : 100
        //     ,timeout           : 5000
        // });
        //
        // return () => {
        //     navigator.geolocation.clearWatch(interval);
        // }
    });

    return (
        <WalkmapContext.Provider value={{data, setData}}>
            {children}
        </WalkmapContext.Provider>
    );
}