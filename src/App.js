import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderSplashScreen: false,
            battery: 1,
            temperature: 0,
            stateStr: "Apogee",
            lat: 42.40574232,
            long: -71.23549720,
            vehicleClock: new Date(0),
            vel: 0,
            accel: 0,
            altitude: 0,
            receiver: false,
            rocket: false,
            missionClock: new Date(),
            receiverIsConnected: false,
            rocketIsConnected: false,
            missionStateStr: "IDLE"
        }
    }

    componentDidMount() {
        setInterval(() => this.testClock(), 1000);
        // setInterval(() => this.changeAccel(), 1000);
        setInterval(() => this.updateVel(), 100);
        setInterval(() => this.updateAltitude(), 100);
        setTimeout(() => this.hideSplashScreen(), 7000);
    }

    componentWillUnmount() {
        clearInterval(this.testClock());
        clearInterval(this.changeAccel());
        clearInterval(this.updateVel());
        clearInterval(this.updateAltitude());
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

    async updateAltitude() {
        const telemetryFetch = await fetch('http://127.0.0.1:3005/api/telemetry').catch((error) => {
            console.log(error);
        });

        const json = telemetryFetch.json();
        console.log(json);
        this.state.altitude = json.Altitude;
    }

    hideSplashScreen() {

        this.setState({
            renderSplashScreen: false
        });
    }
    
    render() {
        return (
            <div className="App">
                <main>
                    <Layout
                        {...this.state}
                        />

                    <div className={this.state.renderSplashScreen ? 'splash' : 'splashFade'}>
                        <SplashScreen/>
                    </div>
                </main>
            </div>
        );
    }
}