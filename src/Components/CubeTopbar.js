import React from 'react';

export default class CubeTopbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSettings: false,
        }
        
    }

    toggleSettings() {
        this.setState({
            showSettings: !this.state.showSettings,
        });
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
        this.props.windowFunc(0)
    }

    render() {
        return (
            <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh"}}>
                <div className={"row"} style={{height:"1vh"}}></div>
                <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleSettings()} /* show settings menu */>Settings</button>

                <div className={`panel ${!this.state.showSettings ? "hidden" : this.props.dark ? "darkPanel settingsPanel" : "lightPanel settingsPanelLight"}`} /* all the settings are contained in here */ >
                    <div style={{height:"5px"}}/>
                    <div className={"row"}>
                        <div style={{width:"5px"}}/>
                        <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleUnits()}>Units: {this.props.showMetric ? "Metric" : "Imperial" }</button>
                        <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleMode()}>Mode: {this.props.dark ? "Dark" : "Light" }</button>
                    </div>
                    <div className={"row"}>
                        <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.handleWindowChange()}>Return to Main Window</button>
                    </div>

                </div>

            </div>
        )
    }
}