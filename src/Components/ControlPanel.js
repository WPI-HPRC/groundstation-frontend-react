import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

class Console extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consoleInput: ">",
            commandHistory: props.commandHistory,
        }

        this.handleConsoleEnter = this.handleConsoleEnter.bind(this);
        this.handleConsoleChange = this.handleConsoleChange.bind(this);
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.commandHistory !== props.commandHistory) {
            return {
                commandHistory: props.commandHistory,
            }
        }
        return null
    }

    handleConsoleChange(event) {
        if (event.target.value.length > 0) {
        this.setState({
            consoleInput: event.target.value});
        }
    }

    handleConsoleEnter(event) {
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
                        {this.state.commandHistory.reverse().map((elem, i) => (<p className="command" key={i}>{elem}</p>))}
                    </div>
                    <input style={{position: "absolute", bottom: 0, left: 0, right: 0, width: "100%"}} type="text" onKeyDown={this.handleConsoleEnter} onChange={this.handleConsoleChange} value={this.state.consoleInput}/>
                </div>
            </>
        )
    }
}

export default class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            tsInput: (props.timeScale / 10).toString(),
            showConnect: props.showConnectButton
        };

        this.handleTSChange = this.handleTSChange.bind(this);
        this.handleTSSubmit = this.handleTSSubmit.bind(this);
        this.handleTSEnter = this.handleTSEnter.bind(this);
        this.handleConnect = this.handleConnect.bind(this);

    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.showConnect !== props.showConnectButton) {
            return {
                showConnect: props.showConnectButton,
            }
        }
        return null
    }

    handleTSChange(event) {
        if ((isNumeric(event.target.value) || event.target.value === "") && event.target.value.length < 5) {
            this.setState({tsInput: event.target.value});
        } 
    }

    handleTSInc(event) {
        var newVal = parseInt(this.state.tsInput, 10) + 1;
        if (newVal < 10000) {
            this.setState({
                tsInput: newVal.toString()
            }, () => this.handleTSSubmit());
        }
    }

    handleTSDec(event) {
        var newVal = parseInt(this.state.tsInput, 10) - 1;
        if (newVal > 0) {
            this.setState({
                tsInput: newVal.toString()
            }, () => this.handleTSSubmit());
        }
    }

    handleTSEnter(event) {
        if (event.key === 'Enter') {
            this.handleTSSubmit();
        }
    }

    handleTSSubmit(event) {
        this.props.tsFunc(this.state.tsInput);
    }

    handleConnect(event) {
        this.props.connFunc();
    }

    handleDisconnect(event) {
        this.props.disconnFunc();
    }

    handleReset(event) {
        this.props.resetFunc();
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="ControlPanel" style={{height: "100%"}}>
                    <div style={{position: "relative", width: "100%", height: "100%"}}>
                        <h3 style={{position: "absolute"}}>{">"} Console</h3>

                        <Grid style={{height: "100%", position: "absolute", bottom: 0, margin: "5px", padding: 0}}>
                            <Row style={{height: "100%"}}>
                                <Col lg={4} style={{position: "relative", textAlign: "center"}}>    
                                    <div style={{position: "absolute", bottom: 70, left: 0, right: 0, margin: 0}}>
                                        <div className={this.state.showConnect ? "inline" : "hidden"}>
                                            <button className="customButtonLg" onClick={() => this.handleConnect()}>Connect</button>
                                        </div>
                                        <div className={!this.state.showConnect ? "inline" : "hidden"}>
                                            <button className="customButtonLg" onClick={() => this.handleDisconnect()}>Disconnect</button>
                                        </div>
                                        <button className="customButtonLg" style={{display: "inline-block"}} onClick={() => this.handleReset()}>Reset</button>
                                        {/* <button className="customButtonLg" style={{display: "inline-block"}} onClick={() => this.handleReset()}>Clear</button> */}
                                    </div>
                                    <div className="subpanel" style={{width: "100%", textAlign: "center", position: "absolute", bottom: 0, margin: 0}}>
                                        <h4 style={{margin: "0px 0px 0px 0px"}}>Graph Timeslice (Seconds):</h4>
   
                                        <button className="customButtonSm mono" onClick={() => this.handleTSDec()}>-</button>
                                        <input style={{margin: "5px 0px 5px 0px", textAlign: "center"}} type="text" size={4 } value={this.state.tsInput} onKeyDown={this.handleTSEnter} onChange={this.handleTSChange}/>
                                        <button className="customButtonSm mono" onClick={() => this.handleTSInc()}>+</button>
                                    </div>
                                </Col>

                                <Col lg={8} style={{height: "100%", position: "relative", margin: "0px"}}>
                                    <div className="subpanel" style={{height: "90%", width: "90%", position: "absolute", right: 20, bottom: 2}}>
                                        <Console handleCommandFunc={this.props.commandFunc} commandHistory={this.props.commandHistory}/>
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