import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

export default class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tsInput: "",
        };

        this.handleTSChange = this.handleTSChange.bind(this);
        this.handleTSSubmit = this.handleTSSubmit.bind(this);
    }

    handleTSChange(event) {
        if ((isNumeric(event.target.value) || event.target.value === "") && event.target.value.length < 5) {
            this.setState({tsInput: event.target.value});
        }
    }

    handleTSSubmit(event) {
        this.props.tsFunc(this.state.tsInput);
    }

    render() {
        return (
            <div className="panel">
                <div className="ControlPanel">
                    <div style={{width: "100%", height: "100%"}}>
                        <h3>Controls</h3>

                        <Grid>
                            <Col lg="2">
                                <Row>
                                    <h4 style={{margin: "0px 0px 0px 0px"}}>Graph Timeslice (Seconds):</h4>
                                </Row>
                                <Row>
                                    <input style={{margin: "5px 0px 5px 20px"}} type="text" size={2} value={this.state.tsInput} onChange={this.handleTSChange}/>
                                    <button className="customButtonSm" onClick={() => this.handleTSSubmit()}>Submit</button>
                                </Row>
                            </Col>
                        </Grid>
                        <button className="customButtonLg" >Reset</button>
                        <button className="customButtonLg" >Connect</button>
                        <button className="customButtonSm" >Browse</button>
                        <button className="customButtonSm" >Export</button>
                        <button className="customButtonSm" >Destroy</button>
                    </div>
                </div>
            </div>
        );
    }
}