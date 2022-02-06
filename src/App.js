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
        // setInterval(() => this.changeVel(), 100);
        // setInterval(() => this.changeAccel(), 100);
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

    changeVel() {
        var vel = this.state.vel;
        if (vel > 300) {
            vel = 0;
        } else {
            vel++;
        }
        this.setState({
            vel: vel
        })
    }

    changeAccel() {
        this.setState({
            accel: Math.ceil(Math.random() * 100)
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