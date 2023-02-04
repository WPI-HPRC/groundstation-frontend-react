import React from 'react';
import AirbrakesIndicator from './AirbrakesIndicator';

/**
 *   Left-top panel, showing general vehicle information including power, temp, pressure, airbrakes etc.
 * 
 *   
 */

class VehicleState extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            stateStr: props.stateStr,
            dark: props.dark,
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.stateStr !== props.stateStr ||
            current_state.dark !== props.dark) {
            update = {
                stateStr: props.stateStr,
                dark: props.dark,
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
            <div style={{display:"inline-block", height: "100%", width: "100%", textAlign: "center", padding: "10px"}}>
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
        this.state = { 
            time: props.time,
            dark: props.dark,
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.time !== props.time ||
            current_state.dark !== props.dark) {
            return {
                time: props.time,
                dark: props.dark,
            }
        }
        return null
    }

    render() {
        var clockStr = this.state.time.toISOString().substr(11, 12);

        return (
            <div style={{display:"inline-block", position: "relative", height:"100%", width: "100%", textAlign: "center"}}>
                <h1 className="subpanel" style={{margin: "auto", color: this.state.dark ? "#ffffff" : "#000000", width: "70%", fontSize: "5vh"}}>{clockStr}</h1>
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
            vehicleClock: props.vehicleClock,
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.battery !== props.battery ||
            current_state.temperature !== props.temperature ||
            current_state.pressure !== props.pressure ||
            current_state.humidity !== props.humidity ||
            current_state.stateStr !== props.stateStr ||
            current_state.lat !== props.lat ||
            current_state.long !== props.log ||
            current_state.vehicleClock !== props.vehicleClock ||
            current_state.airbrakesDeploy !== props.airbrakesDeploy ||
            current_state.dark !== props.dark) {
            update = {
                battery: props.battery,
                temperature: parseFloat(props.temperature).toFixed(2),
                pressure: parseFloat(props.pressure).toFixed(2),
                humidity: parseFloat(props.humidity).toFixed(2),
                stateStr: props.stateStr,
                lat: props.lat,
                long: props.long,
                airbrakesDeploy: props.airbrakesDeploy,
                vehicleClock: props.vehicleClock,
                dark: props.dark,
            }
        }
        
        return update;
    }

    render() {

        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{position: "relative", width: "100%", height: "57vh"}}>
                <div className="VehicleStatus" style={{height: "100%"}}>
                    <div style={{height:"7vh"}}>
                        <h3>Vehicle Status</h3>
                        <hr/>
                        <div style={{height:"2vh"}}/>
                    </div>
                    <div className={"row"} style={{height: "8vh"}}>
                        <div className={"col-lg-6"}>
                            <h4>Battery: {this.state.battery}V</h4>
                            <h4>Temperature: {this.state.temperature} °F</h4>
                        </div>
                        <div className={"col-lg-6"}>
                            <h4>Pressure: {this.state.pressure} inHg</h4>
                            <h4>Humidity: {this.state.humidity} %</h4>
                        </div>
                    </div>
                    <div style={{height: "12vh"}}>
                        <VehicleState stateStr={this.state.stateStr} />
                    </div>
                    <div style={{height:"2vh"}}/>
                    <hr/>
                    <div className={"row"} style={{position: "relative", bottom: "7px", height: "12vh"}}>
                        <div className={"col-lg-5"} style={{height: "100%"}}>
                            <AirbrakesIndicator airbrakesDeploy={this.state.airbrakesDeploy} dark={this.state.dark}/>
                        </div>
                        <div className={"col-lg-5"} style={{height: "100%"}}>
                            <div style={{height: "43%"}}/>
                            <h4>Airbrakes: {this.state.airbrakesDeploy}%</h4>

                        </div>
                    </div>
                    {/* Airbrakes indicator goes here */}

                    <div style={{position: "relative", height: "8vh", width: "100%"}}>
                        <hr/>
                        <h4 style={{marginBottom:"0px"}}>Flight Clock:</h4>
                        <FlightClock time={this.state.vehicleClock} dark={this.state.dark}/>
                    </div>
                </div>
            </div>
        );
    }
}