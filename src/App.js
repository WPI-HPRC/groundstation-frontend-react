import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import React from 'react';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            battery: 1,
            temperature: 0,
            stateStr: "Powered Ascent",
            lat: 42.40574232,
            long: -71.23549720,
            vehicleClock: new Date(0),
            vel: 0,
            accel: 0,
            altitude: 0,
            receiver: false,
            rocket: false,
            missionClock: new Date()
        }
    }

    componentDidMount() {
        setInterval(() => this.testClock(), 1000);
        setInterval(() => this.changeAccel(), 100);
        setInterval(() => this.updateVel(), 100);
        setInterval(() => this.updateAltitude(), 100);

    }

    testClock() {
        var clock = this.state.vehicleClock;
        clock.setSeconds(clock.getSeconds() + 1);
        this.setState({
            vehicleClock: clock
        });

        this.setState({
            missionClock: new Date()
        });
    }

    changeAccel() {
        this.setState({
            accel: Math.ceil(Math.random() * 2)
        });
    }

    updateVel() {
        var vel = this.state.vel;
        if (vel > 50) {
            vel = 0;
        } else {
            vel += this.state.accel;
        }
        this.setState({
            vel: vel
        })
    }

    updateAltitude() {
        var altitude = this.state.altitude;
        if (altitude > 1000) {
            altitude = 0;
        } else {
            altitude += this.state.vel;
        }

        this.setState({
            altitude: altitude
        });
    }

    
    render() {
        return (
            <div className="App">
                <main>
                    <Layout
                        {...this.state}
                        />
                </main>
            </div>
        );
    }
}