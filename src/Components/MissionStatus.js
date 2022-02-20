import React from 'react';

class StatusIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { connected: props.connected,
                       refresh: "-",
                       latency: "-",
                       systemName: props.name,
                       blinkOn: false};
        this.blinkWarning = this.blinkWarning.bind(this)
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.connected !== props.connected ||
            current_state.refresh !== props.refresh ||
            current_state.latency !== props.latency) {
            update = {
                connected: props.connected,
                refresh: props.refresh,
                latency: props.latency,
            }
        }
        
        return update;
    }

    componentDidMount() {
        setInterval(this.blinkWarning, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.blinkWarning);
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
                <h4 style={{position: "absolute", left: "40%", padding: "0px 0px 0px 20px", margin: "0px 0px 20px 0px"}}>
                    RFS: <font style={{color: getColor(this.state.refresh)}}>{this.state.refresh}</font>ms
                </h4>
                <h4 style={{position: "absolute", left: "60%", padding: "0px 0px 0px 20px", margin: "0px 0px 20px 0px"}}>
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
            missionStateStr: props.missionStateStr
         };
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.missionStateStr !== props.missionStateStr) {
            update = {
                missionStateStr: props.missionStateStr
            }
        }
        
        return update;
    }

    render() {
        
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
                <h4 style={{margin: "0px 0px 10px"}}>Groundstation State</h4>
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
            showConnect: props.showConnectButton
        }

        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisonnect = this.handleDisconnect.bind(this);
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.receiverIsConnected !== props.receiverIsConnected ||
            current_state.rocketIsConnected !== props.rocketIsConnected ||
            current_state.missionStateStr !== props.missionStateStr ||
            current_state.lastUpdate !== props.lastUpdate ||
            current_state.latency !== props.latency ||
            current_state.showConnect !== props.showConnectButton) {

            if (props.latency === "-" && props.lastUpdate === "-") {
                return {
                    receiverIsConnected: props.receiverIsConnected,
                    rocketIsConnected: props.rocketIsConnected,
                    lastUpdate: props.lastUpdate,
                    lastUpdates: [],
                    latency: props.latency,
                    latencies: [],
                    showConnect: props.showConnectButton,
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
            }
        }

        return update;
    }

    handleConnect(event) {
        this.props.connFunc();
    }

    handleDisconnect(event) {
        this.props.disconnFunc();
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
                        <div style={{display: "inline-block", width: "50%"}}>
                            <h3>Ground Station Status</h3>
                        </div>
                        <div style={{display: "inline-block", width: "50%", textAlign: "right"}}>
                            <div className={!this.state.showConnect ? "inline" : "hidden"}>
                                <button className="customButtonLg" style={{margin: "0px 20px 0px 0px"}} onClick={() => this.handleDisconnect()}>Disconnect</button>
                            </div>
                            <div className={this.state.showConnect ? "inline" : "hidden"}>
                                <button className="customButtonLg" style={{margin: "0px 20px 0px 0px"}} onClick={() => this.handleConnect()}>Connect</button>
                            </div>
                        </div>
                        <hr/>
                        <div style={{position: "absolute", top: "80px", width: "100%"}}>
                            <StatusIndicator name="Receiver" connected={this.state.receiverIsConnected} refresh={runningAvgRefresh} latency={runningAvgLatency}/>
                        </div>
                        <div style={{position: "absolute", top: "120px", width: "100%"}}>
                            <StatusIndicator name="Rocket" connected={this.state.rocketIsConnected} refresh={"-"} latency={"-"}/>
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