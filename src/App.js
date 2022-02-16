import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

const dataPollingRate = 100;    // Time in ms to poll the telemetry server
const maxMessages = 250;
// const server = "ws://ted-laptop.dyn.wpi.edu"
const server = "ws://127.0.0.1"
const port = "3005"
var socket;

/* TODO
//Sat test 20b
Gyro XYZ
Altitude
Accel XYZ
Temperature
Timestamp
State
*/

export default class App extends React.Component {

    constructor(props) {
        super(props);

        /**
         * Any of the values that will be updated during runtime and affect the
         * children should be defined here
         */
        this.state = {
            renderSplashScreen: false,
            dark: true,
            battery: "-",
            temperature: "-",
            stateStr: "-",
            lat: 42.2743,
            long: -71.8081,
            vehicleClock: new Date(0),
            lastUpdate: 0,
            latency: 0,
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
            showConnectButton: true,
            commandHistory: []
        }

        /**
         * Functions that can be called from children to affect the app
         */
        this.configFuncs = {
            tsFunc: this.updateTimescale,
            connFunc: this.connectToReceiver,
            disconnFunc: this.disconnectFromReceiver,
            resetFunc: this.resetTelem,
            commandFunc: this.handleConsoleCommand,
        }

        /**
         * For logging
         */
        this.commandHistory = [];
        this.showRawInConsole = false;

        /**
         * Binding functions to app
         */
        this.connectToReceiver = this.connectToReceiver.bind(this);
        this.getTelem = this.getTelem.bind(this);
        this.handleConsoleCommand = this.handleConsoleCommand.bind(this);
    }

    /**
     * Things done at launch
     */
    componentDidMount() {
        setTimeout(() => this.hideSplashScreen(), 7000);
    }

    /**
     * Connect to the ws server
     */
    connectToReceiver = () => {
        socket = new WebSocket(server+":"+port);

        this.setState({
            receiverIsConnected: true,
            showConnectButton: false
        });

        // Update telemetry
        socket.onmessage = function(event) {
            let message = event.data;
            this.getTelem(message);
        }.bind(this);
    }

    /**
     * Disconnect from the ws server
     */
    disconnectFromReceiver = () => {
        this.setState({
            receiverIsConnected: false,
            rocketIsConnected: false,
            missionStateStr: "Disconnected",
            showConnectButton: true
        });
        socket.close();
        
    }

    /**
     * Parse message from receiver, update telemetry and app state
     */
    getTelem(message) {
        
        // Good connection
        let json = JSON.parse(message);
        let vehicleTime = new Date(json.Timestamp);
        let receiverTime = new Date(json.ReceiverTime);

        let diff = 0;
        if (this.state.vehicleClock.getTime() !== 0) {
            diff = vehicleTime.getTime() - this.state.vehicleClock.getTime();
        }

        let latency = Date.now() - receiverTime.getTime();

        if (this.showRawInConsole) {
            console.log("here");
            this.pushConsoleMessage(json.RawData);
        }

        this.setState({
            vel: json.Velocity,
            altitude: json.Altitude,
            battery: json.Voltage,
            stateStr: json.State,
            vehicleClock: vehicleTime,
            lastUpdate: diff,
            latency: latency,
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

    /**
     * Hide splashscreen after animation
     */
    hideSplashScreen() {
        this.setState({
            renderSplashScreen: false
        });
    }

    /**
     * Change the graph timescale
     */
    updateTimescale = (ts) => {
        if (ts > 0 && ts < 10000) {
            this.setState({
                timeScale: ts * (dataPollingRate / 10)
            });
        }
    }

    /**
     * Parse incoming commands from console
     */
    handleConsoleCommand = (command) => {
        this.pushConsoleMessage(command);

        switch(command) {
            case "clear":
                this.commandHistory = [];
                this.setState({
                    commandHistory: this.commandHistory
                });
                break;
            case "raw":
                this.showRawInConsole = true;
                break;
            case "stop":
                this.showRawInConsole = false;
                break;
            case "help":
                this.pushConsoleMessage("raw, stop, clear, help");
                break;
            default:
                this.pushConsoleMessage(`Command "${command}" not recognized`)

        }
    }

    /**
     * Place message on console
     */
    pushConsoleMessage = (message) => {
        var time = new Date();
        var timeStr = "[" + time.toISOString().substr(11, 11) + "]>";

        this.commandHistory.push(timeStr + message);

        this.setState((state, props) => ({
            commandHistory: this.commandHistory.slice(-1 * maxMessages)
        }));
    }
    
    /**
     * Reset state of app to default values
     */
    resetTelem = () => {

        if (!this.state.receiverIsConnected) {
            this.setState ({
                battery: "-",
                temperature: "-",
                stateStr: "-",
                lat: "-",
                long: "-",
                vehicleClock: new Date(0),
                lastUpdate: 0,
                latency: 0,
                vel: 0,
                accel: 0,
                altitude: 0,
                accelX: 0,
                accelY: 0,
                accelZ: 0,
                rocketIsConnected: false,
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
