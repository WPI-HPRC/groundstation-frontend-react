import React from 'react';
import 'leaflet.offline';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import RocketViewer from './RocketViewer';
/**
 *  for visualization of things imported from outside React
 *  current usage: map
 *  planning to add 3D model of rocket (and quad?)
 */

export default class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: props.lat,
            lng: props.long,
            zoom: 15,
            map: null,
            dark: props.dark,
            showMap: true,
        }

        this.map = 0;
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.dark !== props.dark) {
            return {
                dark: props.dark,
            }
        }
        return null
    }

    componentDidMount() {
    }

    toggleVis() {
        this.setState((state, props) => ({
            showMap: !state.showMap
        }));
        console.log(this.state.showMap);
    }

    render() {

        var position = [42.27470400012541,-71.80915315792504];
        
        return (
            <>
                <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                    <div className={!this.state.showMap ? "hidden" : "mapDiv"}>
                        <MapContainer center={position} zoom={13} scrollWheelZoom={true} maxZoom={14}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="Maps/{z}/{x}/{y}.png"
                            />
                            <button className={!this.state.showMap ? "hidden" : "visToggle"} id="visToggle" onClick={() => this.toggleVis()}>3D</button> 
                        </MapContainer>
                    </div>
                    <div className={this.state.showMap ? "hidden" : "mapDiv"}>
                        <button className={"showMap"} onClick={() => this.toggleVis()}>Map</button>
                        <RocketViewer></RocketViewer>
                    </div>
                </div>
                <style jsx="true"> {`
                    .leaflet-container {
                        width: 100%; 
                        height: 100%;
                        z-index: 0;
                      }
                `}

                </style>
            </>
        );
    }
}