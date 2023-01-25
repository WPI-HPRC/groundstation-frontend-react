import './App.css';
import '@progress/kendo-theme-default/dist/all.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';
import { wait } from '@testing-library/user-event/dist/utils';

const dataPollingRate = 100;    // Time in ms to poll the telemetry server
const maxMessages = 20;
// const server = "ws://ted-laptop.dyn.wpi.edu"
const server = "ws://127.0.0.1"
const port = "3005"
var socket;

const HIGH_REFRESH = 500;
const LOW_REFRESH = 100;

export default class App extends React.Component {

    constructor(props) {
        super(props);

        /**
         * Any of the values that will be updated during runtime and affect the
         * children should be defined here
         */
        this.state = {
            renderSplashScreen: true,
            dark: true,
            battery: "-",
            temperature: "-",
            pressure: "-",
            humidity: "-",
            stateStr: "-",
            lat: "-",
            long: "-",
            vehicleClock: new Date(0),
            lastUpdate: "-",
            latency: "-",
            vel: 0,
            altitude: 0,
            accelX: 0,
            accelY: 0,
            accelZ: 0,
            gyroX: 0,
            gyroY: 0,
            gyroZ: 0,
            missionClock: new Date(),
            receiverIsConnected: false,
            rocketIsConnected: false,
            missionStateStr: "Idle",
            timeScale: 50,
            graphRefreshRate: 100,
            showConnectButton: true,
            commandHistory: [],
            slowLog: false,
            fastLog: false,
            showMetric: false,
            airbrakesDeploy: 0,
            rocketQuaternion: [0, 0, 0, 0],
            window: 0,
            lastTemp: 0,
            lastHmid: 0,
            lastPres: 0,
            cubeStrength1: 1,
            cubeStrength2: 0,
            cubeStrength3: 0.75,
            cubeBattery1: 1,
            cubeBattery2: 0.5,
            cubeBattery3: 0.75,
        }

        /**
         * Functions that can be called from children to affect the app
         * IMPORTANT: make sure that these are called with the correct value, especially if using 
         * an async function like setState() to set the value going into the function
         */
        this.configFuncs = {
            tsFunc: this.updateTimescale,
            connFunc: this.connectToReceiver,
            disconnFunc: this.disconnectFromReceiver,
            resetFunc: this.resetTelem,
            commandFunc: this.handleConsoleCommand,
            unitFunc: this.updateMetric,
            modeFunc: this.updateMode,
            windowFunc: this.updateWindow,
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
        this.updateMetric = this.updateMetric.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.updateWindow = this.updateWindow.bind(this);
        
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
        this.pushConsoleMessage("Connecting to receiver...", "white");
        
        this.setState({
            missionStateStr: "Connecting..."
        });

        socket = new WebSocket(server+":"+port);

        // Connection opened
        socket.addEventListener('open', function (event) {
            this.pushConsoleMessage("Connected to receiver.", "green");
            this.setState({
                receiverIsConnected: true,
                showConnectButton: false,
                missionStateStr: "Connected"
            });
        }.bind(this));

        // Connection closed
        socket.addEventListener('close', function (event) {
            if (this.state.receiverIsConnected) {
                this.pushConsoleMessage("Lost connection to receiver.", "red");
                this.setState({
                    receiverIsConnected: false,
                    showConnectButton: true,
                    missionStateStr: "Disconnected",
                    lastUpdate: "-",
                    latency: "-",
                    slowLog: false,
                    fastLog: false
                });
            }
        }.bind(this));

        // Listen for possible errors
        socket.addEventListener('error', function (event) {
            this.pushConsoleMessage("Could not connect to reciever.", "red");

            this.setState({
                receiverIsConnected: false,
                rocketIsConnected: false,
                showConnectButton: true,
                missionStateStr: "Disconnected",
                lastUpdate: "-",
                latency: "-",
                slowLog: false,
                fastLog: false
            });
        }.bind(this));

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
            showConnectButton: true,
            lastUpdate: "-",
            latency: "-",
            slowLog: false,
            fastLog: false
        });
        socket.close();

        this.pushConsoleMessage("Disconnected from receiver.", "green");
        
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
            this.pushConsoleMessage(json.RawData, "white");
        }

        this.setState({
            vel: json.Velocity,
            altitude: json.Altitude,
            temperature: json.Temperature,
            pressure: json.Pressure,
            humidity: json.Humidity,
            battery: json.Voltage,
            stateStr: json.State,
            vehicleClock: vehicleTime,
            lastUpdate: diff,
            latency: latency,
            rocketIsConnected: json.RocketConnected,
            accelX: ((json.AccelX * (1/2048)) * 9.80665).toFixed(2),
            accelY: ((json.AccelY * (1/2048)) * 9.80665).toFixed(2),
            accelZ: ((json.AccelZ * (1/2048)) * 9.80665).toFixed(2),
            gyroX: (json.GyroX * (1/16.4)).toFixed(2),
            gyroY: ((json.GyroY * (1/16.4)) / 60).toFixed(2),
            gyroZ: (json.GyroZ * (1/16.4)).toFixed(2),
            slowLog: json.SlowLogging,
            fastLog: json.FastLogging
        });

        if (latency > 100 && this.state.graphRefreshRate < HIGH_REFRESH) {
            this.setState({
                graphRefreshRate: HIGH_REFRESH
            });
        } 
        else if (this.state.graphRefreshRate > LOW_REFRESH) {
            this.setState({
                graphRefreshRate: LOW_REFRESH
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

    updateMetric = (unit) => {
        this.setState({
            showMetric: unit
        })

    }

    updateMode = (mode) => {
        this.setState({
            dark: mode
        })
    }

    updateWindow = (window) => {
        this.setState({
            window: window
        })
    }

    /**
     * Parse incoming commands from console
     */
    handleConsoleCommand = (command) => {
        this.pushConsoleMessage(command, "white");
        var args = command.split(' ');

        switch(args[0]) {
            case "clear":
                this.commandHistory = [];
                this.setState({
                    commandHistory: this.commandHistory
                });
                break;
            case "raw":
                this.showRawInConsole = true;
                this.pushConsoleMessage("Raw data will be printed to the console...", "green");
                break;
            case "stop":
                this.showRawInConsole = false;
                this.pushConsoleMessage("Raw data will no longer be printed to the console", "red");
                break;
            case "set":
                if(this.state[args[1]] !== undefined) {
                    if (args[2] !== undefined) {
                        var tp = typeof(this.state[args[1]]);
                        var prop = args[1];
                        var val = args[2];

                        if (tp === 'boolean') {
                            if (val === 'true') {
                                val = true;
                            }
                            else if (val === 'false') {
                                val = false;
                            }
                        }
                        else if (tp === 'number') {
                            val = Number(args[2]);
                        } else if (tp === 'object') {
                            val = new Date(args[2]);
                        }

                        this.setState({
                            [prop]: val
                        });
                    }
                } else {this.pushConsoleMessage(`Property "${args[1]}" does not exist`, "red"); }
                break;
            case "get":
                this.pushConsoleMessage(this.state[args[1]], "white");
                break;
            case "reset":
                this.resetTelem();
                break;
            case "run":
                this.pushConsoleMessage(eval(args[1]), "white");
                break;
            case "tick":
                var ms = this.state.vehicleClock.getTime() + 1;
                this.setState({
                    vehicleClock: new Date(ms)
                });
                break;
            case "send":
                socket.send(args[1]);
                break;
            case "c":
                this.connectToReceiver();
                break;
            case "dc":
                this.disconnectFromReceiver();
                break;
            case "z":
                socket.send("zeroTm");
                break;
            case "x":
                socket.send("clearOffset");
                break;
            case "rec":
                socket.send("recRaw");
                break;
            case "benchmark": // testing command: running data at 100 hz to start - benchmark
                let benchIter = 0;

                let msToRun = 10000;

                if([args[1]] !== undefined)
                {
                    msToRun = Number([args[1]]);

                }

                // test conditions definition
                let msTick = 10;

                var t = new Date();
                let startTime = t.getTime();
                while(benchIter < msToRun - msTick)
                {
                    setTimeout(() => {
                        var ms = this.state.vehicleClock.getTime() + msTick;
                        this.setState({
                            vehicleClock: new Date(ms)
                        });
                    }, 0);
                    benchIter += msTick;
                    if(benchIter == msToRun - msTick - msTick)
                    {
                        setTimeout(() => {
                            var ms = this.state.vehicleClock.getTime() + msTick;
                            this.setState({
                                vehicleClock: new Date(ms)
                            });
                            var t2 = new Date();
                            var diff = t2.getTime() - startTime;
                            this.pushConsoleMessage("Test complete!  Total time elapsed: " + diff + " ms");
                            var div = msToRun / msTick;
                            this.pushConsoleMessage("Average latency: " + diff / div + " ms");
                        }, 0);
                    }
                }
                break;
            case "dump":
                socket.send("dump");
                break;
            case "rq":
                if([args[1]] !== undefined &&
                    [args[2]] !== undefined &&
                    [args[3]] !== undefined &&
                    [args[4]] !== undefined) {
                    this.setState({
                        rocketQuaternion: [Number([args[1]]), Number([args[2]]), Number([args[3]]), Number([args[4]])]
                    });
                }
                break;
            case "help":
            case "h":
            
                
                this.pushConsoleMessage(`Help: Display the console commands:
- get [prop] : return the value of a property in state
- set [prop] [val] : change the value of a property
- reset : clear the telemetry state
- run [command] : execute a command in js
- tick : increase the clock by 1ms (forces an update)
- raw : print all incoming telemetry to console
- stop : stop printing all telemetry to console
- clear : clear the console buffer
- benchmark [milliseconds]: run a benchmarking test for the specified time, or 10s`, "white");
                break;
            default:
                this.pushConsoleMessage(`Command "${args[0]}" not recognized`, "red")

        }
    }

    /**
     * Place message on console
     */
    pushConsoleMessage = (message, color) => {
        var time = new Date();
        var timeStr = "[" + time.toISOString().substr(11, 11) + "]>";

        this.commandHistory.push([timeStr + message, color]);

        this.setState((state, props) => ({
            commandHistory: this.commandHistory.slice(-1 * maxMessages)
        }));
    }

    zeroGauges() {
        socket.send("Here is a message!");
    }
    
    /**
     * Reset state of app to default values
     */
    resetTelem = () => {

        if (!this.state.receiverIsConnected) {
            this.setState ({
                battery: "-",
                temperature: "-",
                pressure: "-",
                humidity: "-",
                stateStr: "-",
                lat: "-",
                long: "-",
                vehicleClock: new Date(0),
                lastUpdate: "-",
                latency: "-",
                vel: 0,
                accel: 0,
                altitude: 0,
                accelX: 0,
                accelY: 0,
                accelZ: 0,
                gyroX: 0,
                gyroY: 0,
                gyroZ: 0,
                rocketIsConnected: false,
                missionClock: new Date(),
                missionStateStr: "Idle",
                showConnectButton: true,
                slowLog: false,
                fastLog: false
            });
        }
        else {
            this.setState({
                vel: 0,
                accel: 0,
                altitude: 0,
                accelX: 0,
                accelY: 0,
                accelZ: 0,
                gyroX: 0,
                gyroY: 0,
                gyroZ: 0,
                vehicleClock: new Date(0),
            })
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
