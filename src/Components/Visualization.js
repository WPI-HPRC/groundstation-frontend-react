import React from 'react';
import 'leaflet.offline';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import RocketViewer from './RocketViewer';
import danDSB2 from '../dandsb2.png';
import gone from '../gone.png';

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
            imgToShow: 0,
            corndog: props.corndog,
            angle: 0,
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
        const L = require('leaflet');
        const corndog = L.icon({
            iconUrl: this.props.corndog ? danDSB2 : gone,
            iconRetinaUrl: this.props.corndog ? danDSB2 : gone,
            iconSize: this.props.corndog ? [64,64] : [0,0],
            iconAnchor: [32, 64],
            popupAnchor: null,
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null
        });
 
        if(this.state.angle !== 359) 
        {
            this.state.angle = this.state.angle + 1;
        } else {
            this.state.angle = 0;
        }
        
        let posX = 39.583013
        let posY = -74.227006
        var posXOffset = 0.01 * Math.cos(this.state.angle / 360 * 2 * Math.PI);
        var posYOffset = 0.01 * Math.sin(this.state.angle / 360 * 2 * Math.PI);

        var position = [posX + posXOffset,posY + posYOffset];

        var mapBasePos = [42.2738330, -71.8098040];

        return (
            <>
                <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                    <div className={!this.state.showMap ? "hidden" : "mapDiv"}>
                        <MapContainer center={mapBasePos} zoom={14} scrollWheelZoom={true} maxZoom={14}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="Maps/{z}/{x}/{y}.png"
                            />
                            <Marker icon={corndog} position={position}></Marker>
                            <button className={!this.state.showMap ? "hidden" : "visToggle"} id="visToggle" onClick={() => this.toggleVis()}>
                                <img alt="a rocket" className={"visIcon"} src={'rocket_icon_2.png'} ></img>
                            </button> 
                        </MapContainer>
                    </div>
                    <div className={this.state.showMap ? "hidden" : "visDiv"} id={"canvas3D"}>
                        <button className={this.state.dark ? "showMap customButtonLg" : "showMap customButtonLgLight"} onClick={() => this.toggleVis()}>
                            Map
                        </button>
                        <RocketViewer className={this.state.showMap ? "hidden" : undefined} {...this.props}/>


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