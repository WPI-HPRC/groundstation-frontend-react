import React from 'react';
import Button from 'react-bootstrap/Button';
import { ArcGauge } from "@progress/kendo-react-gauges";
import RealtimeLineChart from "./RealtimeLineChart";
import LiveSplineChart from './LiveSplineChart';
import ChartViewer from './ChartViewer';

const TIME_RANGE_IN_MILLISECONDS = 30 * 1000;
const ADDING_DATA_INTERVAL_IN_MILLISECONDS = 1000;
const ADDING_DATA_RATIO = 0.8;

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class VelBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            drawGraph: false,
            vel: 0,
            data: []
        };
    }

    componentDidMount() {
        setInterval(() => this.changeVel(), 500);
    }

    changeVel() {
        this.setState({
            vel: Math.ceil(Math.random() * 100)
        });

        let array = [...this.state.data, this.state.vel];
        this.state.data = array;
    }

    handleClick() {
        this.setState({
            drawGraph: !this.state.drawGraph
        });
    }
    
    
    render() {

        const colors = [
            {
              to: 0,
              color: "#6D6D6D",
            },
            {
              from: 0,
              to: 100,
              color: "#ED5031",
            }
        ];

        const arcOptions = {
            value: this.state.vel,
            colors
        }

        const centerRenderer = (value, color) => {

            return (
                <>
                    <h4>m/s</h4>
                    <h3
                        style={{
                        color: "#F7F7F7",
                        fontSize: "3em",
                        margin: "5px",
                        }}
                    >
                        {padLeadingZeros(value, 3)}
                    </h3>
                </>
            );
        };

        return (
            <>
                <div id='VelBox' style={{display:"inline-block", width:"33%", height:"100%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>Velocity</h3>
                        </div>
                        <div style={{display:"inline-block", textAlign:"right", width: "50%"}}>
                            <Button onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </Button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} id='VelMeter'>
                        <div style={{display: "inline-block", margin: "0 auto"}}>
                            <ArcGauge {...arcOptions} centerRender={centerRenderer} scale={{startAngle: -40, endAngle: 220, rangeSize: 10, min: 0, max: 300}}/>
                        </div>
                    </div>


                    <div className={!this.state.drawGraph ? "hidden" : undefined} id='VelGraph'>
                        <div style={{display: "inline-block", margin: "0 auto"}}>
                            <LiveSplineChart 
                                data={this.state.data} 
                            title="Velocity" />*
                        </div>    
                    </div>
                </div>
            </>
        )
    }
}


/**
 * Acceleration display
 * @param {*} props 
 */
 class AccelBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = { drawGraph: false,
                       accel: 0 };
    }

    componentDidMount() {
        setInterval(() => this.changeAccel(), 1000);
    }

    changeAccel() {
        this.setState({
            accel: Math.ceil(Math.random() * 100)
        })
    }

    handleClick() {
        this.setState({
            drawGraph: !this.state.drawGraph
        });
    }

    render() {

        const colors = [
            {
              to: 80,
              color: "#6D6D6D",
            },
            {
              from: 80,
              to: 100,
              color: "#ED5031",
            }
        ];

        const arcOptions = {
            value: this.state.accel,
            colors
        }

        const centerRenderer = (value, color) => {

            return (
                <>
                    <h4>m/s/s</h4>
                    <h3
                    style={{
                        color: "#F7F7F7",
                        fontSize: "3em",
                        margin: "5px",
                    }}
                    >
                        {padLeadingZeros(value, 3)}
                    </h3>
                </>

            );
        };
        var data = {
            date: new Date(),
            Car: 0,
        };

        return (
            <>
                <div id='AccelBox' style={{display:"inline-block", width:"33%", height:"100%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>Acceleration</h3>
                        </div>
                        <div style={{display:"inline-block", textAlign:"right", width: "50%"}}>
                            <Button onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className={this.state.drawGraph ? "hidden" : undefined} id='AccelMeter'>
                        <div style={{display: "inline-block", margin: "0 auto"}}>
                            <ArcGauge {...arcOptions} centerRender={centerRenderer} scale={{startAngle: -40, endAngle: 220, rangeSize: 10, min: 0, max: 100}}/>
                        </div>
                    </div>


                    <div className={!this.state.drawGraph ? "hidden" : undefined} id='AccelGraph'>
                        I am a graph
                    </div>
                </div>
            </>
        )
    }
}


/**
 * Altitude display
 * @param {*} props 
 */
class AltBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = { drawGraph: false,
                       altitude: 0 };
    }

    componentDidMount() {
        setInterval(() => this.changeAltitude(), 500);
    }

    handleClick() {
        this.setState({
            drawGraph: !this.state.drawGraph
        });
    }

    changeAltitude() {
        this.setState({
            altitude: Math.ceil(Math.random() * 100)
        });
    }

    render() {

        var data = {
            date: new Date(),
            Car: 0,
        };

        const colors = [
            {
                to: 80,
                color: "#6D6D6D"
            },
            {
                from: 80,
                to: 100,
                color: "#ED5031"
            }
        ];

        const arcOptions = {
            value: this.state.altitude,
            colors
        };

        const centerRender = (value, color) => {
            return (
                <h3 style={{
                    color: "#F7F7F7",
                    fontSize: "3em",
                    margin: "5px"
                }}>
                    {padLeadingZeros(value, 3)}
                </h3>
            );
        };

        return (
            <>
                <div id='AltBox' style={{display:"inline-block", width:"33%", height:"100%", verticalAlign: "top"}}>
                    <div style={{width: "100%"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>Altitude</h3>
                        </div>
                        <div style={{display:"inline-block", textAlign:"right", width: "50%"}}>
                            <Button onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </Button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} id='AltMeter'>
                        <div style={{display: "inline-block", margin: "0 auto"}}>
                            <ArcGauge {...arcOptions}
                                centerRender={centerRender}
                                scale={{
                                    startAngle: -40,
                                    endAngle: 220,
                                    rangeSize: 10,
                                    min: 0,
                                    max: 300
                                }}/>
                        </div>
                    </div>


                    <div className={!this.state.drawGraph ? "hidden" : undefined} id='AltGraph'>
                        </div>
                    </div>
            </>
        )
    }
}


export default class GaugeCluster extends React.Component {

    render() {
        return (
            <div className="panel">
                <div className="GaugeCluster">
                    <VelBox />
                    <AccelBox />
                    <AltBox />
                </div>
            </div>
        );
        }
}