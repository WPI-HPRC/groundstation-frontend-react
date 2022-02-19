import React from 'react';


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
                <h1 className="subpanel" style={{margin: "auto", color: this.state.color, width: "70%", fontSize: "3em"}}>+{clockStr}</h1>
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
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            vehicleClock: props.vehicleClock
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.battery !== props.battery ||
            current_state.temperature !== props.temperature ||
            current_state.stateStr !== props.stateStr ||
            current_state.lat !== props.lat ||
            current_state.long !== props.log ||
            current_state.vehicleClock !== props.vehicleClock) {
            update = {
                battery: props.battery,
                temperature: props.temperature,
                stateStr: props.stateStr,
                lat: props.lat,
                long: props.long,
                vehicleClock: props.vehicleClock
            }
        }
        
        return update;
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{position: "relative", width: "100%"}}>
                <div className="VehicleStatus">
                    <h3>Vehicle Status</h3>
                    <hr/>
                    <h4>Battery: {this.state.battery}V</h4>
                    <h4>Temperature: {this.state.temperature}°C</h4>
                    <VehicleState stateStr={this.state.stateStr}/>
                    <hr/>
                    <h4>Position:</h4>
                    <h4>{this.state.lat}, {this.state.long}</h4>
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