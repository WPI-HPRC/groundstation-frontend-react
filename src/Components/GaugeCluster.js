import React from 'react';
import Button from 'react-bootstrap/Button';
import { ArcGauge } from "@progress/kendo-react-gauges";
import LiveSplineChart from './LiveSplineChart';

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class Box extends React.PureComponent {

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.val !== props.val) {
            return {
                val: props.val,
                data: [...current_state.data.slice(props.datanum * -1), props.val]
            }
        }

        return null
    }

    constructor(props) {
        super(props);
        this.state = { 
            drawGraph: false,
            val: props.val,
            data: []
        };
    }

    handleClick() {
        this.setState((state, props) => ({
            drawGraph: !state.drawGraph
        }));
    }
       
    render() {

        const colors = [
            {
              to: this.props.threshold,
              color: "#6D6D6D",
            },
            {
              from: this.props.threshold,
              to: this.props.max,
              color: "#ED5031",
            }
        ];

        const arcOptions = {
            value: this.state.val,
            colors
        }

        const centerRenderer = (value, color) => {

            return (
                <>
                    <h4>{this.props.unit}</h4>
                    <h3
                        style={{
                        color: "#F7F7F7",
                        fontSize: "3em",
                        margin: "5px",
                        }}
                    >
                        {padLeadingZeros(value, this.props.digits)}
                    </h3>
                </>
            );
        };

        return (
            <>
                <div style={{display:"inline-block", width:"33%", height:"100%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>{this.props.title}</h3>
                        </div>
                        <div style={{display:"inline-block", textAlign:"right", width: "50%"}}>
                            <Button onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </Button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined}>
                        <ArcGauge {...arcOptions} centerRender={centerRenderer} scale={{startAngle: -40, endAngle: 220, rangeSize: 10, min: this.props.min, max: this.props.max}}/>
                    </div>

                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{height: "100%"}}>
                        <LiveSplineChart 
                            data={this.state.data} 
                        title={this.props.title} />   
                    </div>

                </div>
            </>
        )
    }
}


export default class GaugeCluster extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            vel: props.vel,
            accel: props.accel,
            altitude: props.altitude
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.vel !== props.vel ||
            current_state.accel !== props.accel ||
            current_state.altitude !== props.altitude) {
            update = {
                vel: props.vel,
                accel: props.accel,
                altitude: props.altitude
            }
        }
        
        return update;
    }

    render() {
        return (
            <div className="panel">
                <div className="GaugeCluster">
                    <Box title="Velocity" unit="m/s" min={0} max={300} threshold={200} digits={3} datanum={10} val={this.state.vel}/>
                    <Box title="Acceleration" unit="m/s/s" min={0} max={300} threshold={200} digits={2} datanum={100} val={this.state.accel}/>
                    <Box title="Altitude" unit="m" min={0} max={1000} threshold={900} digits={4} datanum={100} val={this.state.altitude}/>
                </div>
            </div>
        );
        }
}