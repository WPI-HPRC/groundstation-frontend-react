import React from 'react';
import { ArcGauge } from "@progress/kendo-react-gauges";
import LiveSplineChart from './LiveSplineChart';

const config = require('../mission.cfg');
const dataScalar = -1;


function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class Box extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            drawGraph: false,
            val0: props.val0,
            val1: props.val1,
            val2: props.val2,
            time: props.time,
            graphTime: props.time,
            data0: [],
            data1: [],
            data2: [],
            enable: false,
            gaugeLevel: 0,
            max: 0,
            rollingAvg: 0,
        };
    }

    // Data update performed here
    static getDerivedStateFromProps(props, current_state) {

        // Update on new time
        if (current_state.time !== props.time) {

            // Reset if rocket time returns to 0
            if (props.time.getTime() === 0) {
                return {
                    val0: 0,
                    val1: 0,
                    val2: 0,
                    data0: [],
                    data1: [],
                    data2: [],
                    max: 0,
                    time: props.time
                }
            }

            // Update data sets with new values
            else {  
                //props.time - current_state.graphTime > config.graphRefresh
                // Set graph refresh rate
                    return {
                        val0: props.val0,
                        val1: props.val1,
                        val2: props.val2,
                        data0: [...current_state.data0.slice(props.datanum * dataScalar), [props.time.getTime(), props.val0]],
                        data1: [...current_state.data1.slice(props.datanum * dataScalar), [props.time.getTime(), props.val1]],
                        data2: [...current_state.data2.slice(props.datanum * dataScalar), [props.time.getTime(), props.val2]],
                        max: current_state.max > props.val0 ? current_state.max : props.val0,
                        time: props.time,
                        graphTime: props.time
                    }

            }
        }

        return null
    }

    componentDidMount() {
        setTimeout(() => {this.initAnimation()}, 8000);
    }

    handleClick() {
        this.setState((state, props) => ({
            drawGraph: !state.drawGraph
        }));
    }
    
    initAnimation() {
        this.setState({
            gaugeLevel: this.props.max
        });

        setTimeout(() => {
            this.setState({
                enable: true,
                drawGraph: this.props.defaultToGraph
            });
        }, 1000);
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
            value: this.state.enable ? this.state.val0 : this.state.gaugeLevel,
            colors
        }

        const centerRenderer = (value, color) => {

            return (
                <>
                    <h4>{this.props.unit}</h4>
                    <h3
                        className="subpanel"
                        style={{
                        color: "#F7F7F7",
                        fontSize: "3.5em",
                        margin: "0px 0px 20px 0px",
                        }}
                    >
                        {padLeadingZeros(value, this.props.digits)}
                    </h3>
                </>
            );
        };

        return (
            <>
                <div style={{display:"inline-block", position: "relative", width:"33%", height:"100%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", height: "20%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>{this.props.title}</h3>
                        </div>
                        <div style={{position: "absolute", top:0, right: 0, bottom: 0, left: 0, textAlign:"right", margin: "10px 0px 0px 0px"}}>
                            <button className={"customButtonLg"} onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{height: "80%"}}>
                        <ArcGauge {...arcOptions} centerRender={centerRenderer} style={{width: "100%", height: "100%"}} scale={{startAngle: -40, endAngle: 220, rangeSize: 10, min: this.props.min, max: this.props.max}}/>
                    </div>
                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", bottom: 0, right: 0, height: "15%", textAlign: "right"}}>
                            <h3 style={{margin: 0, padding: 5}}>Max: {this.state.max}</h3>
                    </div>

                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{height: "100%", width: "80%", position:"absolute", top: "50px"}}>
                        <LiveSplineChart
                            data0={this.state.data0} name0={this.props.name0}
                            data1={this.state.data1} name1={this.props.name1}
                            data2={this.state.data2} name2={this.props.name2}
                            datanum={this.props.datanum} 
                            title={this.props.title} /> 
                    </div>
                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", top: "25%", right: 0, height: "0%", textAlign: "right"}}>
                        <h3 style={{fontSize: "2.5em", margin: 0, padding: 0}}>
                            {this.state.val0}
                        </h3>
                        <h4 style={{ margin: 0, padding: 0}}>
                            {this.props.unit}
                        </h4>
                    </div>  
                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", bottom: 0, right: 0, height: "5%", textAlign: "right"}}>
                        <h4 style={{ margin: 0, padding: 0}}>
                            {this.props.datanum / 10}s
                        </h4>
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
            dark: props.dark,
            vel: props.vel,
            accelX: props.accelX,
            accelY: props.accelY,
            accelZ: props.accelZ,
            altitude: props.altitude,
            vehicleClock: props.vehicleClock,
            timeScale: props.timeScale,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.vehicleClock !== props.vehicleClock ||
            current_state.timeScale !== props.timeScale) {
            update = {
                vel: props.vel,
                accelX: props.accelX,
                accelY: props.accelY,
                accelZ: props.accelZ,
                altitude: props.altitude,
                vehicleClock: props.vehicleClock,
                timeScale: props.timeScale
            }

        }
        
        return update;
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="GaugeCluster" style={{height: "90%"}}>
                    <Box title="Velocity" unit="m/s" min={0} max={300} defaultToGraph={false}
                        threshold={200} digits={3} 
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.vel}/>
                    <Box title="Acceleration" unit="m/s/s (X)" min={0} max={3000} 
                        threshold={2000} digits={4} defaultToGraph={true}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} 
                        val0={this.state.accelX} name0="X"
                        val1={this.state.accelY} name1="Y"
                        val2={this.state.accelZ} name2="Z"/>
                    <Box title="Altitude" unit="m" min={0} max={9999} defaultToGraph={false}
                        threshold={900} digits={4} 
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.altitude}/>
                </div>
            </div>
        );
        }
}