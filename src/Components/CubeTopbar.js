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

    render() {
        return (
            <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"19vh"}}>
                <div className={"row"} style={{height:"1vh"}}></div>
                <button className={"customButtonLg"} onClick={() => this.toggleSettings()} /* show settings menu */>Settings</button>

                <div className={`panel ${!this.state.showSettings ? "hidden" : this.props.dark ? "darkPanel" : "lightPanel"} settingsPanel`} /* all the settings are contained in here */ >
                    <div style={{height:"5px"}}/>
                    <div className={"row"}>
                        <div style={{width:"5px"}}/>
                        <button className={"customButtonLg"} onClick={() => this.toggleUnits()}>Units: {this.props.showMetric ? "Metric" : "Imperial" }</button>
                        <button className={"customButtonLg"} onClick={() => this.toggleMode()}>Mode: {this.props.dark ? "Dark" : "Light" }</button>
                    </div>
                    

                </div>

            </div>
        )
    }
}