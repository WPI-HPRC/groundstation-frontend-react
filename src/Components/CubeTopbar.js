import React from 'react';

export default class CubeTopbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSettings: false,
            connectedR: false,
            latency: 0,
        }
        
    }

    toggleSettings() {
        if(this.state.showSettings){
            this.setState({
                showSettings: false,
            })
        } else {
            this.setState({
                showSettings: true,
            })
        }
    }
    toggleUnits() {
        this.props.unitFunc(!this.state.showMetric)
        this.setState({
            showMetric: !this.state.showMetric
        });
    }
    toggleMode() {
        this.props.modeFunc(!this.props.dark)
        this.setState({
            dark: !this.props.dark,
        });
    }

    handleWindowChange() {
        this.props.windowFunc(0);
        this.setState({
            showSettings: false,
        });
    }

    // static getDerivedStateFromProps(props, current_state) {
    //     if(current_state.showSettings !== props.showSettings) {
    //         return {
    //             showSettings: props.showSettings,
    //         }
    //     }
    //     return null;
    // }

    

    render() {
        return (
            <div className="row">
                <div style={{width: "0.375vw"}}/>
                <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh", width:"86vw"}}>
                    <div className={"row"} style={{height:"1vh"}}></div>
                
                    <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleSettings()} /* show settings menu */>Settings</button>

                    <div className={`panel ${!this.state.showSettings ? "hidden" : this.props.dark ? "darkPanel settingsPanel" : "lightPanel settingsPanelLight"}`} /* all the settings are contained in here */ >
                        <div style={{height:"5px"}}/>
                        <div className={"row"} /* top row of buttons */ > 
                            <div style={{width:"8px"}}/>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleUnits()} style={{width: "150px"}}>Units: {this.props.showMetric ? "Metric" : "Imperial" }</button>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleMode()}>Mode: {this.props.dark ? "Dark" : "Light" }</button>
                        </div>
                        <div className={"row"} style={{height: "5px"}}></div>
                        <div className={"row"} /* bottom row of buttons */ >
                        <div style={{width:"8px"}}/>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.handleWindowChange()} style={{width: "150px"}}>Main Window</button>
                        </div>
                    </div>

                </div>
                <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh", width:"13.375vw", margin:"0px", marginTop:"5px"}}>
                    <div style={{height:"30px"}}/>
                    <div className={"row"}>
                        <div style={{width:"10px"}}/>
                        <h4>Receiver: </h4> 
                        <h4 style={{color: this.state.connectedR ? "green" : "#ED5031", position: "relative", right:"35px"}}>{this.state.connectedR ? "Connected" : "Disconnected"} </h4> 
                    </div>
                    <div className={"row"}>
                        <div style={{width:"10px"}}/>
                        <h4>Latency: </h4> 
                        <h4 style={{position: "relative", right:"35px"}}>{this.state.connectedR ? this.state.latency + "ms" : "-"}</h4> 
                    </div>
                    <div className={"row"} >
                        <div style={{width:"3.25vw"}}/>
                        <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"}>{this.state.connectedR ? "Disconnect" : "Connect"}</button>
                    </div>
                </div>
            </div>
        )
    }
}