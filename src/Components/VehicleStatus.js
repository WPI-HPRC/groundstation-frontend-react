import React from 'react';


class VehicleState extends React.Component {

    constructor(props) {
        super(props);
        this.state = { vehicleStateStr: props.vehicleState,
                       };
    }

    render() {

        var color = "red"
        switch (this.state.vehicleStateStr) {
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
                <div style={{display: "inline-block", backgroundColor: color, borderRadius: "5px", width: "50%", boxShaddow: "2px 2px 5px #000000" }}>
                    <h3>
                    {this.state.vehicleStateStr}
                    </h3>
                </div>
            </div>
        )
    }
}

class FlightClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: "00:00:00",
                       color: "white"};
    }

    render() {
        return (
            <div style={{display:"inline-block", width: "100%", textAlign: "center"}}>
                <h1 style={{margin: "0px", color: this.state.color}}>+{this.state.time}</h1>
            </div>
        )
    }
}


export default class VehicleStatus extends React.Component {
    state = {
        lightMode: false,
        batteryVoltage: 0,
        temperature: 0,
        rocketStateStr: "Powered Ascent",
        lat: 42.4043457,
        long: -71.5331474
    }

    render() {
        return (
            <div className="panel" style={{backgroundColor: this.state.lightMode ? "#F7F7F7" : "#212121"}}>
                <div className="VehicleStatus">
                    <h3>Vehicle Status</h3>
                    <hr/>
                    <h4>Battery: {this.state.batteryVoltage}v</h4>
                    <h4>Temperature: {this.state.temperature}c</h4>
                    <VehicleState vehicleState={this.state.rocketStateStr}/>
                    <hr/>
                    <h4>Position:</h4>
                    <h4>{this.state.lat}, {this.state.long}</h4>
                    <hr/>
                    <h4>Flight Clock:</h4>
                    <FlightClock/>
                </div>
            </div>
        );
    }
}