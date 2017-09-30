import React from 'react';
import { Map, TileLayer, Circle, Popup, ScaleControl } from 'react-leaflet';

const darkMatter = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

const LeafletMap = () => {
    return (
        <div>
            <Map center={[39.9528, -75.1638]} zoom={12}>
                <TileLayer
                    layer="CartoDB_DarkMatter"
                    url={darkMatter}
                />
                <ScaleControl />
            </Map>
        </div>
    );
};

export default LeafletMap;

/*
Note: to get user's location, use navigator.geolocation.getCurrentPosition();

function will take one argument (callback function). The parameter of that callback
function is an object with coords (which contains an object with lat/long) and a timestamp
Put map center on state, initally set it to the middle of the country but as soon
as the user allows for their location to be found, set it to the user's location.
*/
