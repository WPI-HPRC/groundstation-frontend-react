import React from 'react';

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

                        <label>Graph Timescale (s):
                            <input type="text" size={2} value={this.state.tsInput} onChange={this.handleTSChange}/>
                        </label>
                        <button onClick={() => this.handleTSSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}