import React from 'react';
import { FlightClock } from './VehicleStatus';

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
                <div style={{width: "0.75vw"}}/>
                <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh", width:"20vw"}}>
                    <div style={{height:"35%"}}/>
                    <div style={{right:"20px", height:"100%", width:"100%"}}>
                        <FlightClock time={this.props.vehicleClock} dark={this.props.dark}/>
                    </div>
                </div>
                <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh", width:"58.375vw", position:"relative"}}>
                    <div className={"row"} style={{height:"10vh", bottom:"2.5vh", position:"relative"}}>
                        <div className="TitlePlate">
                            <h1 className="titleLG">WPI <img alt="HPRC Logo" src="hprc logo red.png" style={{height: "8vh", width: "6.5vh"}}/> HPRC</h1>
                            <h4 className="subTitleLG">Payload GS</h4>
                        </div>
                    </div>

                    

                </div>
                <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh", width:"20vw", marginTop:"5px", marginRight:"0px", paddingRight:"0px"}}>
                    <div style={{height:"30px"}}/>
                    <div className={"row"} style={{width:"100%"}}>
                        <div style={{width:"1.5vw"}}/>
                        <h4 style={{padding:"0px"}}>Receiver: </h4> 
                        <h4 style={{color: this.state.connectedR ? "green" : "#ED5031", position: "relative", padding: "0px", left:"5px"}}>{this.state.connectedR ? "Connected" : "Disconnected"} </h4> 
                    </div>
                    <div className={"row"}>
                        <div style={{width:"1.5vw"}}/>
                        <h4 style={{padding:"0px"}}>Latency: </h4> 
                        <h4 style={{position: "relative", padding:"0px", right:"-5px"}}>{this.state.connectedR ? this.state.latency + "ms" : "-"}</h4> 
                    </div>
                    <div className={"row"} >
                        <div style={{width:"2.25vw"}}/>
                        <button /* Connect/Disconnect */ className={this.props.dark ? "customButtonLg" : "customButtonLgLight"}>{this.state.connectedR ? "Disconnect" : "Connect"}</button>
                        <div style={{width:"2vw"}}/>
                        <button /* Settings */ className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleSettings()} /* show settings menu */>Settings</button>


                    </div>
                    <div style={{height:"11vh", position:"absolute", left:"82vw"}} className={`panel ${!this.state.showSettings ? "hidden" : this.props.dark ? "darkPanel settingsPanel" : "lightPanel settingsPanelLight"}`} /* all the settings are contained in here */ >
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
            </div>
        )
    }
}