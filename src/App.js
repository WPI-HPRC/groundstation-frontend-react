import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderSplashScreen: true,
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
        setInterval(() => this.getTelem(), 100);
        setInterval(() => this.testClock(), 1000);
        setTimeout(() => this.hideSplashScreen(), 7000);
    }

    componentWillUnmount() {
        clearInterval(this.testClock());
        clearInterval(this.getTelem());
    }

    async getTelem() {
        const telemetryFetch = await fetch('http://127.0.0.1:3005/api/telemetry', {method: 'GET', mode: 'cors'}).catch((error) => {

            // Lost connection
            this.setState({receiverIsConnected: false});
            console.log(error);
        }).then(response => {
            if (response.ok) {

                // Good response
                this.setState({receiverIsConnected: true});
                return response.json().then(response => ({response}));
            }

            // Bad connection
            this.setState({receiverIsConnected: false});
            return response.json().then(error => ({error}));
        });

        let json = telemetryFetch.response;

        this.setState({
            vel: json.Velocity,
            accel: json.Acceleration,
            altitude: json.Altitude,
            battery: json.Voltage,
            stateStr: json.State
            //vehicleClock: new Date(0).setTime(json.Timestamp)
        });
    }

    testClock() {
        var clock = this.state.vehicleClock;
        clock.setSeconds(clock.getSeconds() + 1);
        /*this.setState({
            vehicleClock: clock
        });*/

        this.setState({
            missionClock: new Date()
        });
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