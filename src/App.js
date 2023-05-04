import './App.css';
import Layout from "./Components/Layout";
import SplashScreen from "./Components/SplashScreen.js"
import React from 'react';

const dataPollingRate = 100;    // Time in ms to poll the telemetry server
const maxMessages = 20;
// const server = "ws://ted-laptop.dyn.wpi.edu"
const server = "ws://127.0.0.1"
const port = "3005"
const cubeServer = "ws://127.0.0.1"
const cubePort = "3006"
var socket;
var cubeSocket;

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
            state: 0,
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
            timeScale: 10,
            graphRefreshRate: 100,
            showConnectButton: true,
            commandHistory: [],
            slowLog: false,
            fastLog: false,
            showMetric: false,
            airbrakesDeploy: 0,
            rocketQuaternion: [0, 0, 0, 0], // the state estimation of the rocket's orientation
            window: 0, 
            lastTemp1: 0, // last temperature from cube 1
            lastHmid1: 0, // last humidity from cube 1
            lastPres1: 0, // last pressure from cube 1
            lastTemp2: 0, // cube 2
            lastHmid2: 0,
            lastPres2: 0,
            lastTemp3: 0, // cube3
            lastHmid3: 0,
            lastPres3: 0,
            cubeTime1: 0,
            cubeTime2: 0,
            cubeTime3: 0,
            cubeStrength1: 1,
            cubeStrength2: 0,
            cubeStrength3: 0.75,
            cubeBattery1: 1,
            cubeBattery2: 0.5,
            cubeBattery3: 0.75,
            altMSL: true,
            currentAlt: 146.304, // this should be in meters
            powerLossWarning: false,
            graphDisplayMode: 0, // 0-Z; 1-Y; 2-X; 3-all
            rocketLatency: 0, 
            corndog: false,
            signalLossWarning: false,
            sigLossCount: 0,
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
            altModeFunc: this.updateAltMode,
            changeAccelFunc: this.changeAccelMode,
            connCubeFunc: this.connectToCubeReceiver,
            disconnCubeFunc: this.disconnectFromCubeReceiver,

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
        this.connectToCubeReceiver = this.connectToCubeReceiver.bind(this);
        this.getTelem = this.getTelem.bind(this);
        this.getCubeTelem = this.getCubeTelem.bind(this);
        this.handleConsoleCommand = this.handleConsoleCommand.bind(this);
        this.updateMetric = this.updateMetric.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.updateWindow = this.updateWindow.bind(this);
        this.updateAltMode = this.updateAltMode.bind(this);
        this.changeAccelMode = this.changeAccelMode.bind(this);
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

    connectToCubeReceiver = () => {
        this.pushConsoleMessage("Connecting to cube receiver...", "white");
        
        

        cubeSocket = new WebSocket(cubeServer+":"+cubePort);

        // Connection opened
        cubeSocket.addEventListener('open', function (event) {
            this.pushConsoleMessage("Connected to cube receiver.", "green");
            
        }.bind(this));

        // Connection closed
        cubeSocket.addEventListener('close', function (event) {
            if (this.state.receiverIsConnected) {
                this.pushConsoleMessage("Lost connection to cube receiver.", "red");
            }
        }.bind(this));

        // Listen for possible errors
        cubeSocket.addEventListener('error', function (event) {
            this.pushConsoleMessage("Could not connect to cube reciever.", "red");

            
        }.bind(this));

        // Update telemetry
        cubeSocket.onmessage = function(event) {

            let message = event.data;
            this.getCubeTelem(message);
        }.bind(this);
    }

    /**
     * Disconnect from the ws server
     */
    disconnectFromCubeReceiver = () => {
        
        cubeSocket.close();

        this.pushConsoleMessage("Disconnected from cube receiver.", "green");
        
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

        this.setState({
            latency: diff,
        })

        if(diff <= 5) 
        {
            this.setState({
                sigLossCount: this.state.sigLossCount + 1,
            })
        } else {
            this.setState({
                sigLossCount: 0,
                signalLossWarning: false,
            })
        }

        if(diff < -100) {
            this.setState({
                powerLossWarning: true,
            });
        }

        if(this.state.sigLossCount >= 5) {
            this.setState({
                signalLossWarning: true,
            })
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
            vehicleClock: vehicleTime,
            lastUpdate: diff,
            latency: "-",
            state: json.State,
            rocketIsConnected: json.RocketConnected,
            accelX: ((json.AccelX * (1)) * 9.80665).toFixed(2),
            accelY: ((json.AccelY * (1)) * 9.80665).toFixed(2),
            accelZ: ((json.AccelZ * (1)) * 9.80665).toFixed(2),
            gyroX: (json.GyroX * (1)).toFixed(2),
            gyroY: ((json.GyroY * (1))).toFixed(2),
            gyroZ: (json.GyroZ * (1) / 60).toFixed(2),
            slowLog: json.SlowLogging,
            fastLog: json.FastLogging,
            airbrakesDeploy: json.AirbrakesDeploy,

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

    getCubeTelem(message) {
        
        // Good connection
        let json = JSON.parse(message);
    
        if (this.showRawInConsole) {
            this.pushConsoleMessage(json.RawData, "white");
        }

        switch(json.Name) {
            case "Alvin":
                this.setState({
                    lastTemp1: json.Temperature,
                    lastHmid1: json.Humidity,
                    lastPres1: json.Pressure,
                    cubeTime1: new Date(json.Timestamp),
                });
                break;
            case "Simon":
                this.setState({
                    lastTemp2: json.Temperature,
                    lastHmid2: json.Humidity,
                    lastPres2: json.Pressure,
                    cubeTime2: new Date (json.Timestamp),
                });
                break;
            case "Theo":
                this.setState({
                    lastTemp3: json.Temperature,
                    lastHmid3: json.Humidity,
                    lastPres3: json.Pressure,
                    cubeTime3: new Date(json.Timestamp),               
                });
                break;
            default:
                this.setState({
                    lastTemp1: json.Temperature,
                    lastHmid1: json.Humidity,
                    lastPres1: json.Pressure,
                    cubeTime1: new Date(json.Timestamp),
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
    
    updateAltMode = (MSL) => {
        this.setState({
            altMSL: MSL
        })
    }

    updateWindow = (window) => {
        this.setState({
            window: window
        })
    }

    changeAccelMode = () => {
        if(this.state.graphDisplayMode !== 3) {
            this.setState({
                graphDisplayMode: this.state.graphDisplayMode + 1,
            })
        } else {
            this.setState({
                graphDisplayMode: 0,
            })
        }
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
                    if(benchIter === msToRun - msTick - msTick)
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
            case "corndog":
                this.setState({
                    corndog: true,
                });
                let benchIter2 = 0;

                let msToRun2 = 10000;

                // test conditions definition
                let msTick2 = 10;

                var t = new Date();
                while(benchIter2 < msToRun2 - msTick2)
                {
                    setTimeout(() => {
                        var ms = this.state.vehicleClock.getTime() + msTick2;
                        this.setState({
                            vehicleClock: new Date(ms)
                        });
                    }, 0);
                    benchIter2 += msTick2;
                    if(benchIter2 === msToRun2 - msTick2 - msTick2)
                    {
                        setTimeout(() => {
                            var ms = this.state.vehicleClock.getTime() + msTick2;
                            this.setState({
                                vehicleClock: new Date(ms)
                            }); 
                            this.setState({
                                corndog: false,
                            });       
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
            case "arm":
                this.setState({
                    powerLossWarning: false,
                    state: 0,

                });
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
- benchmark [milliseconds]: run a benchmarking test for the specified time, or 10s
- arm: disable all alerts and return display to state zero in preparation for launch`, "white");
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
                state: 0,
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
                powerLossWarning: false,
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
