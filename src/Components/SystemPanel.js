import React from 'react';
import { CircularGauge, ArcGauge } from '@progress/kendo-react-gauges';
import LiveSplineChart from './LiveSplineChart';

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

const dataScalar = -1.1;

export default class SystemPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            gyroX: 0,
            gyroY: 0,
            gyroZ: 0,
            data0: [],
            data1: [],
            data2: [],
            roll: 0,
            time: props.vehicleClock
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.time !== props.vehicleClock) {

            if (props.vehicleClock.getTime() === 0) {
                return {
                    gyroX: props.gyroX,
                    gyroY: props.gyroY,
                    gyroZ: props.gyroZ,
                    data0: [],
                    data1: [],
                    data2: [],
                    time: props.vehicleClock
                }
            }
            else {
                return {
                    gyroX: props.gyroX,
                    gyroY: props.gyroY,
                    gyroZ: props.gyroZ,
                    data0: [...current_state.data0.slice(props.datanum * dataScalar), [props.vehicleClock.getTime(), props.gyroX]],
                    data1: [...current_state.data1.slice(props.datanum * dataScalar), [props.vehicleClock.getTime(), props.gyroY]],
                    data2:[...current_state.data2.slice(props.datanum * dataScalar), [props.vehicleClock.getTime(), props.gyroZ]],
                    time: props.vehicleClock
                }
            }
        }

        return null
    }
    
    render() {

        const colors = [
            {
              to: 160,
              color: "#6D6D6D",
            },
            {
              from: 160,
              to: 180,
              color: "#ED5031",
            }
        ];

        const circularOptions = {
        };

        const centerRenderer = (value, color) => {

            return (
                <>
                    <h3
                        style={{
                        color: "#F7F7F7",
                        fontSize: "2.5em",
                        margin: "0px 0px 0px 10px",
                        padding: "0px 0px 0px 10px"
                        }}
                    >
                        {padLeadingZeros(value, 3)}°
                    </h3>
                </>
            );
        };

        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="SystemPanel" style={{position: "relative", width: "100%", height: "100%"}}>
                    <h3>System</h3>
                    <hr/>
                    <div style={{display: "inline-block", textAlign: "center"}}>
                        <h3>Pitch (X)</h3>
                        <CircularGauge
                            value={Math.abs(this.state.gyroX)}
                            colors={colors}
                            transitions={true}
                            centerRender={centerRenderer}
                            style={{
                            display: "inline-block",
                            }}
                            scale={{
                            rangeSize: 10,
                            rangeLineCap: "round",
                            reverse: this.state.gyroX > 0 ? false : true,
                            startAngle: 90,
                            min: 0,
                            max: 360
                            }}
                        />
                    </div>
                    <div style={{display: "inline-block", textAlign: "center"}}>
                        <h3>Yaw (Y)</h3>
                        <CircularGauge
                            value={Math.abs(this.state.gyroY)}
                            colors={colors}
                            transitions={true}
                            centerRender={centerRenderer}
                            style={{
                            display: "inline-block",
                            }}
                            scale={{
                            rangeSize: 10,
                            rangeLineCap: "round",
                            reverse: this.state.gyroY > 0 ? false : true,
                            startAngle: 90,
                            min: 0,
                            max: 360
                            }}
                        />
                    </div>
                    <div style={{display: "inline-block", textAlign: "center"}}>
                        <h3>Roll (Z)</h3>
                        <CircularGauge
                            value={Math.abs(this.state.gyroZ)}
                            colors={colors}
                            transitions={true}
                            centerRender={centerRenderer}
                            style={{
                            display: "inline-block",
                            }}
                            scale={{
                            rangeSize: 10,
                            rangeLineCap: "round",
                            reverse: this.state.gyroZ > 0 ? false : true,
                            startAngle: 90,
                            min: 0,
                            max: 360
                            }}
                        />

                    </div>
                    <div className="subpanel" style={{width: "70%", position: "absolute", right: 0, bottom: 0}}>
                        {/* <LiveSplineChart
                                data0={this.state.data0} name0="X"
                                data1={this.state.data1} name1="Y"
                                data2={this.state.data2} name2="Z"
                                datanum={this.props.timeScale} 
                                title={this.props.title} />  */}
                    </div>
                    {/* <img src='rocket.png' style={{position: "absolute", top: 0, bottom: 0, right: 0, margin: "auto", transform: "rotate(0.80turn)"}}/> */}
                </div>
            </div>
        );
    }
}
