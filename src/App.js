import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

const dataPollingRate = 80;    // Time in ms to poll the telemetry server
const server = "ws://127.0.0.1"
const port = "3005"

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderSplashScreen: true,
            dark: true,
            battery: "-",
            temperature: "-",
            stateStr: "-",
            lat: 42.2743,
            long: -71.8081,
            vehicleClock: new Date(0),
            lastUpdate: 0,
            vel: 0,
            altitude: 0,
            accelX: 0,
            accelY: 0,
            accelZ: 0,
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
        this.connectToReceiver = this.connectToReceiver.bind(this);
        this.getTelem = this.getTelem.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.hideSplashScreen(), 7000);
    }

    componentWillUnmount() {
        clearInterval(this.testClock());
        clearInterval(this.getTelemId);
        clearInterval(this.reconnId);
    }

    testSpeed() {
        this.setState({
            altitude: Math.ceil(Math.random() * 1000)
        });
    }

    getTelem(message) {
        
        // Good connection
        let json = JSON.parse(message);
        let vehicleTime = new Date(json.Timestamp);

        let diff = 0;
        if (this.state.vehicleClock.getTime() !== 0) {
            diff = vehicleTime.getTime() - this.state.vehicleClock.getTime();
        }

        this.setState({
            vel: json.Velocity,
            altitude: json.Altitude,
            battery: json.Voltage,
            stateStr: json.State,
            vehicleClock: vehicleTime,
            lastUpdate: diff,
            rocketIsConnected: json.RocketConnected,
            accelX: json.Acceleration_X,
            accelY: json.Acceleration_Y,
            accelZ: json.Acceleration_Z,
        });

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
    
    connectToReceiver = () => {
        let socket = new WebSocket(server+":"+port);

        this.setState({
            receiverIsConnected: true
        })
        // Update telemetry
        socket.onmessage = function(event) {
            let message = event.data;

            this.getTelem(message);
        }.bind(this);
    }

    disconnectFromReceiver = () => {
        
        
    }

    tryReconnect = async () => {
        
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
                accelX: 0,
                accelY: 0,
                accelZ: 0,
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
            <div className={`App ${this.state.dark ? "darkApp" : "lightApp"}`}>
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
