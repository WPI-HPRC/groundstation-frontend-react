import React from 'react';

/**
 *  Everything in the right panel except for the map panel
 *  map panel is in Visualization
 */


class StatusIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            connected: props.connected,
            refresh: "-",
            latency: "-",
            systemName: props.name,
            blinkOn: false,
            ID: null,
            dark: props.dark,
            showSettingsPanel: false,
            altMSL: true,
        };
            
        this.blinkWarning = this.blinkWarning.bind(this)
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.connected !== props.connected ||
            current_state.refresh !== props.refresh ||
            current_state.latency !== props.latency ||
            current_state.dark !== props.dark) {
            update = {
                connected: props.connected,
                refresh: props.refresh,
                latency: props.latency,
            }
        }
        
        return update;
    }


    componentDidMount() {
        this.setState({
            ID: setInterval(this.blinkWarning, 1000)
        });
    }

    componentWillUnmount() { // Fixed this.  Clearing a callback uses an ID supplied by the set function, not the name of the function itself.
        clearInterval(this.state.ID);
    }
    
    blinkWarning = () => {
        
        if (!this.state.connected) {
            var blink = this.state.blinkOn;
            this.setState({
                blinkOn: !blink
            });
        } else {
            this.setState({
                blinkOn: false
            })
        }
    }

    render() {
        const renderWarning = () => {
            if (this.state.blinkOn) {
                return <h4 style={{position: "absolute", right: 10 ,textAlign: "right", padding: "0px", color: "#ED5031", margin: "0px 0px 20px 0px"}}>!</h4>;
            }
        }

        const getColor = (val) => {
            if (val < 10) {
                return "#00f700";
            }
            else if (val > 100) {
                return "#ED5031";
            }
        }

        return (
            <div style={{position: "relative", width: "100%"}}>
                <h4 style={{position: "absolute", left: 0, padding: "0px 0px 0px 20px", margin: "0px 0px 20px 0px"}}>
                    {this.state.systemName}: <font style={{color: this.state.connected ? "#00f700" : "#ED5031"}}>{this.state.connected ? "Connected" : "Disconnected"} </font>
                </h4>
                <h4 style={{position: "absolute", left: "50%", padding: "0px 0px 0px 20px", margin: "0px 0px 20px 0px"}}>
                    RFS: <font style={{color: getColor(this.state.refresh)}}>{this.state.refresh}</font>ms
                </h4>
                <h4 style={{position: "absolute", left: "70%", padding: "0px 0px 0px 20px", margin: "0px 0px 20px 0px"}}>
                    LAT: <font style={{color: getColor(this.state.latency)}}>{this.state.latency}</font>ms
                </h4>
                {renderWarning()}
            </div>
        )
    }
}

class MissionState extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            missionStateStr: props.missionStateStr,
            dark: props.dark,
         };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.missionStateStr !== props.missionStateStr ||
            current_state.dark !== props.dark) {
            update = {
                missionStateStr: props.missionStateStr,
                dark: props.dark,
            }
        }
        
        return update;
    }

    render() {
        
        /**
         *  Define colors for the Status indicator
         */

        var color = "red"
        switch (this.state.missionStateStr) {
            case "Connected": 
                color = "green";
                break;
            case "Disconnected":
                color = "red";
                break;
            case "Idle":
                color = "orange";
                break;
            case "Reconnecting":
                color = "orange";
                break;
            default:
                color = "gray";
                break;
        }

        return (
            <div style={{display:"inline-block", width: "100%", textAlign: "center", padding: "10px"}}>
                {/* <h4 style={{margin: "0px 0px 10px"}}>Groundstation State</h4> */}
                <div className="statusIndicator" style={{display: "inline-block", backgroundColor: color}}>
                    <h3>
                    {this.state.missionStateStr}
                    </h3>
                </div>
            </div>
        )
    }
}

export default class MissionStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            dark: props.dark,
            receiverIsConnected: props.receiverIsConnected,
            rocketIsConnected: props.rocketIsConnected,
            missionStateStr: props.missionStateStr,
            lastUpdate: props.lastUpdate,
            lastUpdates: [],
            latency: props.latency,
            latencies: [],
            showConnect: props.showConnectButton,
            slowLog: props.slowLog,
            showMetric: props.showMetric,
            altitude: props.altitude,
            altMSL: props.altMSL,
        }

        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisonnect = this.handleDisconnect.bind(this);
        this.handleUnitSwitch = this.handleUnitSwitch.bind(this);
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.receiverIsConnected !== props.receiverIsConnected ||
            current_state.rocketIsConnected !== props.rocketIsConnected ||
            current_state.missionStateStr !== props.missionStateStr ||
            current_state.lastUpdate !== props.lastUpdate ||
            current_state.latency !== props.latency ||
            current_state.showConnect !== props.showConnectButton ||
            current_state.slowLog !== props.slowLog ||
            current_state.dark !== props.dark ||
            current_state.altMSL !== props.altMSL) {

            if (props.latency === "-" && props.lastUpdate === "-") {
                return {
                    receiverIsConnected: props.receiverIsConnected,
                    rocketIsConnected: props.rocketIsConnected,
                    lastUpdate: props.lastUpdate,
                    lastUpdates: [],
                    latency: props.latency,
                    latencies: [],
                    showConnect: props.showConnectButton,
                    slowLog: props.slowLog,
                    dark: props.dark,
                    altMSL: props.altMSL,
                }
            }
            update = {
                receiverIsConnected: props.receiverIsConnected,
                rocketIsConnected: props.rocketIsConnected,
                missionStateStr: props.missionStateStr,
                lastUpdate: props.lastUpdate,
                lastUpdates: [...current_state.lastUpdates.slice(-100), props.lastUpdate],
                latency: props.latency,
                latencies: [...current_state.latencies.slice(-100), props.latency],
                showConnect: props.showConnectButton,
                slowLog: props.slowLog,
                dark: props.dark,
                altMSL: props.altMSL,
            }
        }

        return update;
    }

    handleUnitSwitch(event) {
        
        /**
         *  IMPORTANT: make sure to pass the correct value into the configFuncs
         *  setState is an async function so if you did
         * 
         *  this.setState({state});
         *  this.props.unitFunc(state);
         * 
         *  it would still pass the old value of state into unitFunc, meaning the state of the button/trigger
         *  and the state of the component using the value would be desynced
         */

        this.props.unitFunc(!this.state.showMetric)
        this.setState({
            showMetric: !this.state.showMetric
        });
        switch(this.state.showMetric) {
            case true:
                break;
            default:
                this.setState({
                    altitude: this.state.altitude * 1000
                });
                break;
        } 
    }

    handleConnect(event) {
        this.props.connFunc();
    }

    handleDisconnect(event) {
        this.props.disconnFunc();
    }
    
    toggleSettingsPanel(event) {
        this.setState({
            showSettingsPanel: !this.state.showSettingsPanel,
        })
    }
    toggleMode(event) {
        this.props.modeFunc(!this.state.dark);
    }

    cubeWindow(event) {
        this.props.windowFunc(1);
        this.setState({
            showSettingsPanel: false,
        })
    }

    toggleAltMode(event) {
        this.props.altModeFunc(!this.state.altMSL);
    }

    render() { 

        var runningAvgRefresh = parseInt(this.state.lastUpdates.reduce((a,b) => a + b, 0) / this.state.lastUpdates.length);
        var runningAvgLatency = parseInt(this.state.latencies.reduce((a,b) => a + b, 0) / this.state.latencies.length);

        runningAvgRefresh = this.state.lastUpdates.length ? runningAvgRefresh : "-";
        runningAvgLatency = this.state.latencies.length ? runningAvgLatency : "-";

        return (

            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="MissionStatus">
                    <div style={{display: "inline-block", position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
                        <div style={{display: "inline-block", width: "10%"}}>
                            <h3>Status</h3>
                        </div>
                        <div style={{display: "inline-block", width: "90%", textAlign: "right"}}>
                            <div className={"inline"}>
                                <button className={this.state.dark ? "customButtonLg" : "customButtonLgLight"} style={{margin: "0px 10px 0px 0px"}} onClick={() => {this.state.showConnect ? this.handleConnect() : this.handleDisconnect()}}>{this.state.showConnect ? "Connect" : "Disconnect"}</button>
                            </div>


                            <div className={"inline"}>
                                <button className={this.state.dark ? "customButtonLg" : "customButtonLgLight"} style={{margin: "0px 20px 0px 0px"}} onClick={() => this.toggleSettingsPanel()}>Settings</button>
                                    <div className={`panel ${!this.state.showSettingsPanel ? "hidden" : this.props.dark ? "darkPanel settingsPanel" : "lightPanel settingsPanelLight"}`} style={{ right:"0px", height:"11vh"}}/* all the settings are contained in here */ >
                                        <div style={{height:"7px"}}/>
                                            <div className={"row"} /* top row of buttons */ > 
                                                <div style={{width:"8px"}}/>
                                                <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.handleUnitSwitch()} style={{width: "150px"}}>Units: {this.props.showMetric ? "Metric" : "Imperial" }</button>
                                                <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleMode()}>Mode: {this.props.dark ? "Dark" : "Light" }</button>
                                            </div>
                                            <div className={"row"} style={{height: "7px"}}></div>
                                            <div className={"row"} /* bottom row of buttons */ >
                                                <div style={{width:"8px"}}/>
                                                <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"}  style={{width: "150px"}} onClick={() => this.cubeWindow()}>Cube Window</button>
                                                <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleAltMode()}>{this.props.altMSL ? "Alt: MSL" : "Alt: AGL"}</button>
                                            </div>
                                        </div>
                                    </div>

                        </div>
                        <hr/>
                        <div style={{position: "absolute", top: "80px", width: "100%"}}>
                            <StatusIndicator name="Receiver" connected={this.state.receiverIsConnected} refresh={runningAvgRefresh} latency={runningAvgLatency}/>
                        </div>
                        <div style={{position: "absolute", top: "120px", width: "100%"}}>
                            <StatusIndicator name="Rocket" connected={this.state.rocketIsConnected} refresh={"-"} latency={"-"}/>
                        </div>
                        <div style={{position: "absolute", top: "140px", width: "100%"}}>
                            <div style={{position: "relative", width: "100%"}}>
                                {/* <h4 style={{display: "inline-block", position: "absolute", left: 0}}>Logging:</h4>  */}
                                {/* <h4 style={{display: "inline-block", position: "absolute", right: 80}}>Slow Log: <font style={{color: this.state.slowLog ? "#00f700" : "#ED5031"}}>{this.state.slowLog ? "On" : "Off"}</font></h4> */}
                                {/* <h4 style={{display: "inline-block", position: "absolute", right: 220}}>Fast Log: <font  style={{color: this.state.fastLog ? "#00f700" : "#ED5031"}}>{this.state.fastLog ? "On" : "Off"}</font></h4> */}
                            </div>
                        </div>
                        <div style={{position: "absolute", bottom: "1%", width: "100%"}}>
                            <MissionState missionStateStr={this.state.missionStateStr}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}