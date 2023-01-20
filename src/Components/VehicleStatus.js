import React from 'react';
 
import airbrakesBackground from '../Airbrakes Diagram.png';
import airbrakesFinTR from '../AirbrakesFinTR.png';
import airbrakesFinTL from '../AirbrakesFinTL.png';
import airbrakesFinBR from '../AirbrakesFinBR.png';
import airbrakesFinBL from '../AirbrakesFinBL.png';

/**
 *   Indicator on middle-left showing status of vehicle
 *   currently used inside MissionStatus
 * 
 *   
 */

class VehicleState extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { stateStr: props.stateStr };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.stateStr !== props.stateStr) {
            update = {
                stateStr: props.stateStr,
            }
        }
       
        return update;
    }
    
    render() {

        var color;
        switch (this.state.stateStr) {
            case "Launch": 
                color = "orange";
                break;
            case "Powered Ascent":
                color = "red";
                break;
            case 0:
                color = '#1aa3e8';
                break;
            default:
                color = "gray";
                break;
        }

        return (
            <div style={{display:"inline-block", width: "100%", textAlign: "center", padding: "10px"}}>
                <h4 style={{margin: "0px 0px 10px"}}>Vehicle State</h4>
                <div className="statusIndicator" style={{display: "inline-block", backgroundColor: color}}>
                    <h3>
                    {this.state.stateStr}
                    </h3>
                </div>
            </div>
        )
    }
}

class FlightClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: props.time,
                       color: "white"};
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.time !== props.time) {
            return {
                time: props.time,
            }
        }
        return null
    }

    render() {
        var clockStr = this.state.time.toISOString().substr(11, 12);

        return (
            <div style={{display:"inline-block", position: "relative", width: "100%", textAlign: "center"}}>
                <h1 className="subpanel" style={{margin: "auto", color: this.state.color, width: "70%", fontSize: "3em"}}>{clockStr}</h1>
            </div>
        )
    }
}


export default class VehicleStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            battery: props.battery,
            temperature: props.temperature,
            pressure: props.pressure,
            humidity: props.humidity,
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            airbrakesDeploy: props.airbrakesDeploy,
            vehicleClock: props.vehicleClock
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.battery !== props.battery ||
            current_state.temperature !== props.temperature ||
            current_state.pressure != props.pressure ||
            current_state.humidity != props.humidity ||
            current_state.stateStr !== props.stateStr ||
            current_state.lat !== props.lat ||
            current_state.long !== props.log ||
            current_state.vehicleClock !== props.vehicleClock ||
            current_state.airbrakesDeploy !== props.airbrakesDeploy) {
            update = {
                battery: props.battery,
                temperature: parseFloat(props.temperature).toFixed(2),
                pressure: parseFloat(props.pressure).toFixed(2),
                humidity: parseFloat(props.humidity).toFixed(2),
                stateStr: props.stateStr,
                lat: props.lat,
                long: props.long,
                airbrakesDeploy: props.airbrakesDeploy,
                vehicleClock: props.vehicleClock
            }
        }
        
        return update;
    }

    render() {
        var fin1X = -109 + this.state.airbrakesDeploy/5;
        var fin2X = -211 - this.state.airbrakesDeploy/5;
        var fin3X = -259 + this.state.airbrakesDeploy/5;
        var fin4X = -135 - this.state.airbrakesDeploy/5;
        var fin1Y = -20 - this.state.airbrakesDeploy/5;
        var fin2Y = -20 - this.state.airbrakesDeploy/5;
        var fin3Y = 8 + this.state.airbrakesDeploy/5;
        var fin4Y = -68 + this.state.airbrakesDeploy/5;




        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{position: "relative", width: "100%"}}>
                <div className="VehicleStatus">
                    <h3>Vehicle Status</h3>
                    <hr/>
                    <div className={"row"}>
                        <div className={"col-lg-6"}>
                            <h4>Battery: {this.state.battery}V</h4>
                            <h4>Temperature: {this.state.temperature} °F</h4>
                        </div>
                        <div className={"col-lg-6"}>
                            <h4>Pressure: {this.state.pressure} inHg</h4>
                            <h4>Humidity: {this.state.humidity} %</h4>
                        </div>
                    </div>
                    <VehicleState stateStr={this.state.stateStr} />
                    <hr/>
                    <div className={"row"}>
                        <div className={"col-lg-4"}>
                            <img src={airbrakesBackground} className={"airbrakesIconBG"}/>
                            
                        </div>
                        <div className={"col-lg-7"}>
                            <h4>Airbrakes: {this.state.airbrakesDeploy} %</h4>
                            <div className={"row"}>
                                <img src={airbrakesFinTR} className={"airbrakesFin"} style={{top:fin1Y, left:fin1X}}/>
                                <img src={airbrakesFinTL} className={"airbrakesFin"} style={{top:fin2Y, left:fin2X}}/>
                                <img src={airbrakesFinBR} className={"airbrakesFin"} style={{top:fin3Y, left:fin3X}}/>                            
                                <img src={airbrakesFinBL} className={"airbrakesFin"} style={{top:fin4Y, left:fin4X}}/>
                            </div>

                        </div>
                    </div>
                    {/* Airbrakes indicator goes here */}

                    <div style={{position: "absolute", bottom: "2%", width: "100%"}}>
                        <hr/>
                        <h4>Flight Clock:</h4>
                        <FlightClock time={this.state.vehicleClock}/>
                    </div>
                </div>
            </div>
        );
    }
}