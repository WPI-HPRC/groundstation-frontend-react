import React from 'react';


class StatusIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: props.connected,
                       level: props.level,
                       systemName: props.name,
                       blinkOn: false};
        this.blinkWarning = this.blinkWarning.bind(this)
    }

    componentDidMount() {
        setInterval(this.blinkWarning, 1000);
    }

    blinkWarning = () => {
        
        if (!this.state.status) {
            var blink = this.state.blinkOn;
            this.setState({
                blinkOn: !blink
            });
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
                <h4 style={{display: "inline-block", width: "70%", padding: "0px 0px 0px 20px", margin: "1.33em 0px 0px 0px"}}>{this.state.systemName}: {this.state.status ? "Connected" : "Disconnected"}</h4>
                {renderWarning()}
            </div>
        )
    }
}

class MissionState extends React.Component {
    constructor(props) {
        super(props);
        this.state = { missionStateStr: props.missionState,
                        };
    }

    render() {
        
        var color = "red"
        switch (this.state.missionStateStr) {
            case "IDLE": 
                color = "orange";
                break;
            case "LIVE":
                color = "green";
                break;
            default:
                color = "gray";
                break;
        }

        return (
            <div style={{display:"inline-block", width: "100%", textAlign: "center", padding: "10px"}}>
                <h4 style={{margin: "0px 0px 10px"}}>Mission State</h4>
                <div style={{display: "inline-block", backgroundColor: color, borderRadius: "5px", width: "50%", boxShaddow: "2px 2px 5px #000000" }}>
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
        this.state = { receiverIsConnected: false,
                       rocketIsConnected: false,
                       missionState: "IDLE"};
    }
    
    render() {
        return (
            <div className="panel" style={{backgroundColor: this.state.lightMode ? "#F7F7F7" : "#212121"}}>
                <div className="MissionStatus">
                    <h3>Mission Status</h3>
                    <hr/>
                    <div style={{display: "inline-block", position: "relative", width: "100%", overflow: "hidden"}}>
                        <StatusIndicator name="Receiver" connected={this.state.receiverIsConnected} level={0}/>
                        <StatusIndicator name="Rocket" connected={this.state.rocketIsConnected} level={0}/>
                        <MissionState missionState={this.state.missionState}/>
                    </div>
                </div>
            </div>
        );
    }
}