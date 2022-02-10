import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

export default class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
            <div className="panel">
                <div className="ControlPanel">
                    <div style={{position: "relative", width: "100%", height: "100%"}}>
                        <h3 style={{display: "inline-block"}}>Controls</h3>

                        <div style={{position: "absolute", top: "0", right: 0, margin: "10px 20px 0px 0px"}}>
                            <button className="customButtonLg" style={{display: "inline-block"}} onClick={() => this.handleReset()}>Reset</button>
                            <div className={this.state.showConnect ? "inline" : "hidden"}>
                                <button className="customButtonLg" onClick={() => this.handleConnect()}>Connect</button>
                            </div>
                            <div className={!this.state.showConnect ? "inline" : "hidden"}>
                                <button className="customButtonLg" onClick={() => this.handleDisconnect()}>Disconnect</button>
                            </div>
                        </div>
                        <Grid>
                            <Row>
                                <Col lg={4}>    
                                    <div style={{width: "100%", textAlign: "center"}}>
                                        <h4 style={{margin: "0px 0px 0px 0px"}}>Graph Timeslice (Seconds):</h4>
   
                                        <button className="customButtonSm mono" onClick={() => this.handleTSDec()}>-</button>
                                        <input style={{margin: "5px 0px 5px 0px"}} type="text" size={2} value={this.state.tsInput} onKeyDown={this.handleTSEnter} onChange={this.handleTSChange}/>
                                        <button className="customButtonSm mono" onClick={() => this.handleTSInc()}>+</button>
                                    </div>
                                </Col>
                                <Col lg={8}>
                                    {/* <button className="customButtonSm" >Browse</button>
                                    <button className="customButtonSm" >Export</button>
                                    <button className="customButtonSm" >Destroy</button>  */}
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}