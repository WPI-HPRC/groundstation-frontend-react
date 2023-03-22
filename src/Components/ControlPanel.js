import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

/**
 *  handles console and timesplice
 */

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

/* the console is at the top of the main screen and is used to enter commands */
class Console extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consoleInput: ">", // in the constructor, this essentially defines what the first character is of any command.  mostly of aesthetics
            commandHistory: props.commandHistory,
            dark: props.dark,
        }

        // functions to do things with the console
        this.handleConsoleEnter = this.handleConsoleEnter.bind(this);
        this.handleConsoleChange = this.handleConsoleChange.bind(this);
    }

    // console input is not going to change during flight, so it doesn't need to be updated
    static getDerivedStateFromProps(props, current_state) {
        if (current_state.commandHistory !== props.commandHistory ||
            current_state.dark !== props.dark) {
            return {
                commandHistory: props.commandHistory,
                dark: props.dark,
            }
        }
        return null;
    }

    handleConsoleChange(event) {
        if (event.target.value.length > 0) {
        this.setState({
            consoleInput: event.target.value});
        }
    }

    handleConsoleEnter(event) { // handle entering a new console command
        if (event.key === 'Enter') {
            this.props.handleCommandFunc(this.state.consoleInput.substring(1));
            this.setState({
                consoleInput: ">"
            });
        }
    }

    render() {

        return (
            <>
                <div style={{height: "100%", position: "relative"}}>
                    <div style={{display: "flex", flexDirection: "column-reverse", height: "80%", overflowY: "auto", overflowWrap: "break-word" }}>
                        {this.state.commandHistory.slice(0).reverse().map((elem, i) => (<p className="command" style={{color: this.props.dark ? "#ffffff" : "#000000"}} key={i}>{elem[0]}</p>))}
                    </div>
                    <input style={{position: "absolute", bottom: 0, left: 0, right: 0, width: "100%"}} type="text" onKeyDown={this.handleConsoleEnter} onChange={this.handleConsoleChange} value={this.state.consoleInput}/>
                </div>
            </>
        )
    }
}

/*
*  this is the section of the center-middle panel which handles the timeslice (now resolution)
*/

export default class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark, // the dark/light state of the UI
            tsInput: (props.timeScale / 10).toString(), // the current value of the resolution (formerly timestamp)
            showConnect: props.showConnectButton // this only exists to be updated.  why? god only knows
        };

        // functions to handle changing resolution
        this.handleTSChange = this.handleTSChange.bind(this);
        this.handleTSSubmit = this.handleTSSubmit.bind(this);
        this.handleTSEnter = this.handleTSEnter.bind(this);
        this.handleConnect = this.handleConnect.bind(this);

    }

    // this one only needs to update the UI color, but we're updating showConnect too for some reason
    static getDerivedStateFromProps(props, current_state) {
        if (current_state.showConnect !== props.showConnectButton ||
            current_state.dark !== props.dark) {
            return {
                showConnect: props.showConnectButton,
                dark: props.dark,
            }
        }
        return null
    }

    // handling changing the resolution - specifically using the input
    handleTSChange(event) { 
        if ((isNumeric(event.target.value) || event.target.value === "") && event.target.value.length < 5) {
            this.setState({tsInput: event.target.value});
        } 
    }

    // handle pressing the increase button
    handleTSInc(event) {
        var newVal = parseInt(this.state.tsInput, 10) + 1;
        if (newVal < 10000) {
            this.setState({
                tsInput: newVal.toString()
            }, () => this.handleTSSubmit());
        }
    }

    // handle pressing the decrease button
    handleTSDec(event) {
        var newVal = parseInt(this.state.tsInput, 10) - 1;
        if (newVal > 0) {
            this.setState({
                tsInput: newVal.toString()
            }, () => this.handleTSSubmit());
        }
    }

    // when you hit 'enter' after typing into the input
    handleTSEnter(event) {
        if (event.key === 'Enter') {
            this.handleTSSubmit();
        }
    }

    // actually updating the resolution
    handleTSSubmit(event) {
        this.props.tsFunc(this.state.tsInput);
    }

    // these two are no longer needed since connect button was moved to MissionStatus
    handleConnect(event) {
        this.props.connFunc();
    }

    handleDisconnect(event) {
        this.props.disconnFunc();
    }

    // reseting the entire ground station
    handleReset(event) {
        this.props.resetFunc();
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="ControlPanel" style={{height: "100%"}}>
                    <div style={{position: "relative", width: "100%", height: "100%"}}>
                        <h3 style={{position: "absolute", fontSize:"2vh"}}>{">"} Console</h3>

                        <Grid style={{height: "100%", position: "absolute", bottom: 0, margin: "5px", padding: 0}}>
                            <Row style={{height: "100%"}}>
                                <Col lg={2} style={{position: "relative", textAlign: "center"}}>    
                                    <div style={{position: "absolute", bottom: 60, left: 0, right: 0, margin: 0}}>

                                        <button className={this.state.dark ? "customButtonLg" : "customButtonLgLight"} style={{display: "inline-block"}} onClick={() => this.handleReset()}>Clear</button>
                                        {/* <button className="customButtonLg" style={{display: "inline-block"}} onClick={() => this.handleReset()}>Clear</button> */}
                                    </div>
                                    <div className="subpanel" style={{width: "100%", textAlign: "center", position: "absolute", bottom: 0, margin: 0}}>
                                        <h4 style={{margin: "0px 0px 0px 0px"}}>Resolution:</h4>
   
                                        <button className={this.state.dark ? "customButtonSm mono" : "customButtonSmLight mono"} onClick={() => this.handleTSDec()}>-</button>
                                        <input style={{margin: "5px 0px 5px 0px", textAlign: "center", backgroundColor: this.state.dark ? "#212121" : "#BDBDBD"}} type="text" size={4 } value={this.state.tsInput} onKeyDown={this.handleTSEnter} onChange={this.handleTSChange}/>
                                        <button className={this.state.dark ? "customButtonSm mono" : "customButtonSmLight mono"} onClick={() => this.handleTSInc()}>+</button>
                                    </div>
                                </Col>

                                <Col lg={10} style={{height: "100%", position: "relative", margin: "0px", textColor: this.state.dark ? "#000000" : "#ffffff"}}>
                                    <div className="subpanel" style={{height: "90%", width: "90%", position: "absolute", right: 20, bottom: 2}}>
                                        <Console style={{backgroundColor: this.state.dark ? "#141414" : "#BDBDBD"}} handleCommandFunc={this.props.commandFunc} commandHistory={this.props.commandHistory} dark={this.state.dark}/>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}