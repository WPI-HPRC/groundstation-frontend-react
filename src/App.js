import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

const dataPollingRate = 100;    // Time in ms to poll the telemetry server

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderSplashScreen: false,
            battery: "-",
            temperature: "-",
            stateStr: "-",
            lat: "-",
            long: "-",
            vehicleClock: new Date(0),
            vel: 0,
            accel: 0,
            altitude: 0,
            missionClock: new Date(),
            receiverIsConnected: false,
            rocketIsConnected: false,
            missionStateStr: "Idle",
            timeScale: 50,
            showConnectButton: true
        }

        this.configFuncs = {
            tsFunc: this.updateTimescale,
            connFunc: this.connectToReceiver,
            disconnFunc: this.disconnectFromReceiver,
            resetFunc: this.resetTelem
        }

        this.getTelemId = 0;
        this.reconnId = 0;
    }

    componentDidMount() {
        setInterval(() => this.testClock(), 1000);
        setTimeout(() => this.hideSplashScreen(), 7000);
    }

    componentWillUnmount() {
        clearInterval(this.testClock());
        clearInterval(this.getTelemId);
    }

    async getTelem() {
        if (this.getTelemId === 0) {
            return;
        }

        const controller = new AbortController()

        // .1 second timeout:
        const timeoutId = setTimeout(() => controller.abort(), 100)

        const telemetryFetch = await fetch('http://127.0.0.1:3005/api/telemetry', {method: 'GET', mode: 'cors', signal: controller.signal}).catch((error) => {

            console.log(error);

        }).then(response => {
            if (response === undefined) {
                // Bad connection
                this.setState({receiverIsConnected: false});
                return undefined;
            }
            else if (response.ok) {
                // Good response
                this.setState({receiverIsConnected: true,
                               showConnectButton: false
                            });
                return response.json().then(response => ({response}));
            }
        });

        if (telemetryFetch === undefined) {

            // Lost connection
            clearInterval(this.getTelemId);
            this.getTelemId = 0;

            this.setState({
                receiverIsConnected: false,
                rocketIsConnected: false,
            });

            if (this.reconnId === 0) {
                this.reconnId = setInterval(() => this.tryReconnect(), 1000);
            }
        }
         else {

            // Good connection
            let json = telemetryFetch.response;
            let vehicleTime = new Date(json.Timestamp);

            this.setState({
                vel: json.Velocity,
                accel: json.Acceleration,
                altitude: json.Altitude,
                battery: json.Voltage,
                stateStr: json.State,
                vehicleClock: vehicleTime,
                rocketIsConnected: json.RocketConnected
            });
        }

        if (this.state.receiverIsConnected && this.state.rocketIsConnected) {
            this.setState({
                missionStateStr: "Connected"
            });
        }
        else {
            this.setState({
                missionStateStr: "Disconnected"
            });
        }
    }

    testClock() {
        this.setState({
            missionClock: new Date()
        });
    }

    hideSplashScreen() {

        this.setState({
            renderSplashScreen: false
        });
    }

    updateTimescale = (ts) => {
        if (ts > 0 && ts < 10000) {
            this.setState({
                timeScale: ts * (dataPollingRate / 10)
            });
        }
    }
    
    connectToReceiver = async () => {

        if (!this.state.receiverIsConnected) {
            const telemetryFetch = await fetch('http://127.0.0.1:3005/api/telemetry', {method: 'GET', mode: 'cors'}).catch((error) => {

                // Lost connection
                console.log(error);
                return;
            })
            
            if (telemetryFetch === undefined) {
                alert("Unable to connect to receiver.");
            } else {

                // Begin polling
                if (this.getTelemId === 0) {
                    this.getTelemId = setInterval(() => this.getTelem(), dataPollingRate);
                }
            }
        }
    }

    disconnectFromReceiver = () => {
        clearInterval(this.getTelemId);
        this.getTelemId = 0;
        clearInterval(this.reconnId);
        this.reconnId = 0;

        setTimeout(() => this.setState({
            receiverIsConnected: false,
            rocketIsConnected: false,
            missionStateStr: "Idle",
            showConnectButton: true
        }), 200);
        
    }

    tryReconnect = async () => {
        if (this.reconnId === 0) {
            return;
        }

        const controller = new AbortController()

        // 1 second timeout:
        const timeoutId = setTimeout(() => controller.abort(), 1000)

        const telemetryFetch = await fetch('http://127.0.0.1:3005/api/telemetry', {method: 'GET', mode: 'cors', signal: controller.signal}).catch((error) => {

            // Lost connection
            console.log(error);
        })
        
        if (telemetryFetch !== undefined) {
            clearInterval(this.reconnId);
            this.reconnId = 0;

            if (this.getTelemId === 0) {
                this.getTelemId = setInterval(() => this.getTelem(), dataPollingRate);
            }
        }

        this.setState ({
            missionStateStr: "Reconnecting"
        })
    }

    resetTelem = () => {

        if (!this.state.receiverIsConnected) {
            this.setState ({
                battery: "-",
                temperature: "-",
                stateStr: "-",
                lat: "-",
                long: "-",
                vehicleClock: new Date(0),
                vel: 0,
                accel: 0,
                altitude: 0,
                missionClock: new Date(),
                missionStateStr: "Idle",
                showConnectButton: true
            });

            clearInterval(this.reconnId);
            this.reconnId = 0;

            clearInterval(this.getTelemId);
            this.getTelemId = 0;
        }
    }

    render() {
        return (
            <div className="App">
                <main>
                    <Layout
                        {...this.state}
                        {...this.configFuncs}
                        />

                    <div className={this.state.renderSplashScreen ? 'splash' : 'splashFade'}>
                        <SplashScreen/>
                    </div>
                </main>
            </div>
        );
    }
}