import React from 'react';

import Map, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../map.css';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

export default class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 42.2741403879473,
            long: -71.80824475604742,
            zoom: 10,
            maxZoom: 30
        }
    }
    
    render() {
        let pos = [this.state.lat, this.state.long]
        return (
            <>
                <div className='panel' style={{width: "100vw", height: "44vh"}}>
                    <Map
                        mapboxAccessToken='pk.eyJ1IjoiZGpwZWFyc29uIiwiYSI6ImNremcwdTE0NzNlYmMycnByczFtbTJ1N3EifQ.Bhsb7qBWXmjz5gXfH7Mv0A'
                        initialViewState={{
                        longitude: this.state.long,
                        latitude: this.state.long,
                        zoom: 3.5
                        }}
                        style={{width: "100%", height: "100%"}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    />
                </div>
            </>
            
        );
    }
};