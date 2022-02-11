import React, { useEffect, useState } from 'react';
import L, {Map} from 'leaflet';
import 'leaflet.offline';
import {MapContainer, Tile, Marker, Popup, TileLayer} from 'react-leaflet';
import {localforage} from 'localforage';
import 'leaflet/dist/leaflet.css'


var map;

export default class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: props.lat,
            lng: props.long,
            zoom: 15,
            map: null,
            dark: props.dark
        }
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
        map = L.map('map').setView({lon: 0, lat: 0}, 14);
        map.setView([42.27470400012541,-71.80915315792504], 14);
        let currentTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 14,
        });
        map.addLayer(currentTile);
    }

    componentDidUpdate() {
    }

    render() {
        
        return (
            <>
                <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                    <div id="map" style={{width:"100%", height: "100%"}}>

                    </div>
                </div>
            </>
        );
    }
}