import React from 'react';


class StatusIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { connected: props.connected,
                       level: props.level,
                       systemName: props.name,
                       blinkOn: false};
        this.blinkWarning = this.blinkWarning.bind(this)
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.connected !== props.connected ||
            current_state.level !== props.level) {
            update = {
                connected: props.connected,
                level: props.level
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
                return <h4 style={{display: "inline-block", width: "20%",textAlign: "right", padding: "0px", color: 'red', margin: "1.33em 0px 0px 0px"}}>!</h4>;
            }
        }

        return (
            <div>
                <h4 style={{display: "inline-block", width: "70%", padding: "0px 0px 0px 20px", margin: "1.33em 0px 0px 0px"}}>{this.state.systemName}: {this.state.connected ? "Connected" : "Disconnected"}</h4>
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
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.receiverIsConnected !== props.receiverIsConnected ||
            current_state.rocketIsConnected !== props.rocketIsConnected ||
            current_state.missionStateStr !== props.missionStateStr ||
            current_state.lastUpdate !== props.lastUpdate ||
            current_state.latency !== props.latency) {
            update = {
                receiverIsConnected: props.receiverIsConnected,
                rocketIsConnected: props.rocketIsConnected,
                missionStateStr: props.missionStateStr,
                lastUpdate: props.lastUpdate,
                lastUpdates: [...current_state.lastUpdates.slice(-100), props.lastUpdate],
                latency: props.latency,
                latencies: [...current_state.latencies.slice(-100), props.latency],
            }
        }

        return update;
    }
    
    render() {

        var runningAvgRefresh = parseInt(this.state.lastUpdates.reduce((a,b) => a + b, 0) / this.state.lastUpdates.length);
        var runningAvgLatency = parseInt(this.state.latencies.reduce((a,b) => a + b, 0) / this.state.latencies.length);
        return (

            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="MissionStatus">
                    <div style={{display: "inline-block", position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
                        <h3>Ground Station Status</h3>
                        <hr/>
                        <StatusIndicator name="Receiver" connected={this.state.receiverIsConnected} level={0}/>
                        <StatusIndicator name="Rocket" connected={this.state.rocketIsConnected} level={0}/>
                        <h4 style={{display: "inline-block", width: "70%", padding: "0px 0px 0px 20px", margin: "1.33em 0px 0px 0px"}}>Refresh: {runningAvgRefresh}ms</h4>
                        <h4 style={{display: "inline-block", width: "70%", padding: "0px 0px 0px 20px", margin: "1.33em 0px 0px 0px"}}>Latency: {runningAvgLatency}ms</h4>
                        <div style={{position: "absolute", bottom: "1%", width: "100%"}}>
                            <MissionState missionStateStr={this.state.missionStateStr}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}