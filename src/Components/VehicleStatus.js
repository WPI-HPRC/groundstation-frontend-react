import React from 'react';


class VehicleState extends React.Component {

    constructor(props) {
        super(props);
        this.state = { stateStr: props.stateStr };
    }

    componentWillReceiveProps(props) {
        this.setState({ stateStr: props.stateStr });  
    }

    render() {

        var color = "red"
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
                <div style={{display: "inline-block", backgroundColor: color, borderRadius: "5px", width: "50%", boxShaddow: "2px 2px 5px #000000" }}>
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

    componentWillReceiveProps(props) {
        this.setState({ 
            time: props.time });  
    }

    render() {
        var clockStr = this.state.time.toISOString().substr(11, 8);

        return (
            <div style={{display:"inline-block", width: "100%", textAlign: "center"}}>
                <h1 style={{margin: "0px", color: this.state.color}}>+{clockStr}</h1>
            </div>
        )
    }
}


export default class VehicleStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            battery: props.battery,
            temperature: props.temperature,
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            vehicleClock: props.vehicleClock
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ 
            battery: props.battery,
            temperature: props.temperature,
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            vehicleClock: props.vehicleClock });  
    }

    render() {
        console.log(this.state);
        return (
            <div className="panel" style={{backgroundColor: this.state.lightMode ? "#F7F7F7" : "#212121"}}>
                <div className="VehicleStatus">
                    <h3>Vehicle Status</h3>
                    <hr/>
                    <h4>Battery: {this.state.battery}V</h4>
                    <h4>Temperature: {this.state.temperature}°C</h4>
                    <VehicleState stateStr={this.state.stateStr}/>
                    <hr/>
                    <h4>Position:</h4>
                    <h4>{this.state.lat}, {this.state.long}</h4>
                    <hr/>
                    <h4>Flight Clock:</h4>
                    <FlightClock time={this.state.vehicleClock}/>
                </div>
            </div>
        );
    }
}