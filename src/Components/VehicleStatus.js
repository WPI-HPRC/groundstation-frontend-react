import React from 'react';
import AirbrakesIndicator, { PowerLossWarningIndicator } from './CustomSVG';

/**
 *   Left-top panel, showing general vehicle information including power, temp, pressure, airbrakes etc.
 * 
 *   
 */

class VehicleState extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            state: props.state,
            dark: props.dark,
            stateStr: "-",
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.state !== props.state ||
            current_state.dark !== props.dark) {
            update = {
                state: props.state,
                dark: props.dark,
            }
        }
       
        return update;
    }
    
    render() {

        var color = "green";
        switch (this.state.state) {
            case 0:
                this.state.stateStr = "Startup";
                break;
            case 1:
                this.state.stateStr = "Pre-Launch";
                break;
            case 2:
                this.state.stateStr = "Boost";
                break;
            case 3:
                this.state.stateStr = "Coast (Contingency)";
                color = "orange";
                break;
            case 4:
                this.state.stateStr = "Coast";
                break;
            case 5:
                this.state.stateStr = "Drogue Deploy";
                break;
            case 6:
                this.state.stateStr = "Drogue (Contingency)";
                color = "orange";
                break;
            case 7:
                this.state.stateStr = "Drogue Descent";
                break;
            case 8:
                this.state.stateStr = "Main (Contingency)";
                color = "orange";
                break;
            case 9:
                this.state.stateStr = "Main Deploy";
                break;
            case 10:
                this.state.stateStr = "Main Descent";
                break;
            case 11:
                this.state.stateStr = "Post-Flight";
                break;
            case 12:
                this.state.stateStr = "Abort";
                color = "red";
                break;
            default:
                this.state.stateStr = "Abducted by Aliens";
        }

        return (
            <div style={{display:"inline-block", height: "100%", width: "100%", textAlign: "center", padding: "10px"}}>
                <h4 style={{margin: "0px 0px 10px"}}>Vehicle State</h4>
                <div className="statusIndicator" style={{display: "inline-block", backgroundColor: color, width: "15vw", height: "8vh"}}>
                    <h3 style={{margin: "2.5vh 0px 3vh 0px"}}>
                    {this.state.stateStr}
                    </h3>
                </div>
            </div>
        )
    }
}

export class FlightClock extends React.Component {
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
                <h1 className="subpanel" style={{margin: 'auto', color: this.state.dark ? "#ffffff" : "#000000", width: "100%", fontSize: "5vh"}}>{clockStr}</h1>
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
            state: props.state,
            lat: props.lat,
            long: props.long,
            airbrakesDeploy: props.airbrakesDeploy,
            vehicleClock: props.vehicleClock,
            showMetric: props.showMetric,
            powerLossWarning: props.powerLossWarning,
            showPowerLossWarning: props.showPowerLossWarning,
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.battery !== props.battery ||
            current_state.temperature !== props.temperature ||
            current_state.pressure !== props.pressure ||
            current_state.humidity !== props.humidity ||
            current_state.state !== props.state ||
            current_state.lat !== props.lat ||
            current_state.long !== props.log ||
            current_state.vehicleClock !== props.vehicleClock ||
            current_state.airbrakesDeploy !== props.airbrakesDeploy ||
            current_state.dark !== props.dark ||
            current_state.showMetric !== props.showMetric ||
            current_state.powerLossWarning !== props.powerLossWarning) {
            update = {
                battery: props.battery,
                temperature: parseFloat(props.temperature).toFixed(2),
                pressure: parseFloat(props.pressure).toFixed(2),
                humidity: parseFloat(props.humidity).toFixed(2),
                state: props.state,
                lat: props.lat,
                long: props.long,
                airbrakesDeploy: props.airbrakesDeploy,
                vehicleClock: props.vehicleClock,
                dark: props.dark,
                showMetric: props.showMetric,
                powerLossWarning: props.powerLossWarning,
                showPowerLossWarning: props.showPowerLossWarning,
            }
        }
        
        return update;
    }

    render() {

        if(this.state.powerLossWarning) 
        {
            this.state.showPowerLossWarning = true;
        }

        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{position: "relative", width: "100%", height: "57vh"}}>
                <div className="VehicleStatus" style={{height: "100%", position:"relative"}}>
                    <div style={{height:"8vh", position: "relative"}}>
                        <div className="row" style={{position: "relative", height: "5vh", width: "100%"}}>
                            <h3>Vehicle Status</h3>
                            <div style={{height:"100%", width:"20%", position: "relative"}}>
                                <div style={{height:"0.5vh"}}/>
                                <PowerLossWarningIndicator style={{top: "10px", height: "30px", width: "30px", position: "relative"}} dark={this.state.dark} powerLossWarning={this.props.powerLossWarning}/>
                            </div>
                        </div>
                        <hr/>
                        <div style={{height:"2vh"}}/>
                    </div>
                    <div className={"row"} style={{height: "8vh"}}>
                        <div className={"col-lg-6"}>
                            <h4>Battery: {this.state.battery}V</h4>
                            <h4>Temperature: {this.state.temperature} {this.state.showMetric ? "°C" : "°F"}</h4>
                        </div>
                        <div className={"col-lg-6"}>
                            <h4>Pressure: {this.state.pressure} {this.state.showMetric ? "Bar" : "inHg"}</h4>
                            <h4>Humidity: {this.state.humidity} %</h4>
                        </div>
                    </div>
                    <div style={{height: "12vh"}}>
                        <VehicleState state={this.state.state} />
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