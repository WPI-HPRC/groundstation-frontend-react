import React from 'react';
import { RPMGauge, CGauge } from './Gauge';

/**
 *  the panel containing the 3 gyroscope gauges (x/y/z, pitch/roll/yaw)
 *  not to be confused with GaugeCluster which handles the position gauges (alt/vel/accel)
 */


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
            time: props.vehicleClock,
            unit: "rpm",
            digits: 3,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.time !== props.vehicleClock || 
            current_state.gyroX !== props.gyroX ||
            current_state.gyroY !== props.gyroY ||
            current_state.gyroZ !== props.gyroZ ||
            current_state.dark !== props.dark) {

            if (props.vehicleClock.getTime() === 0) { // FLAG
                return {
                    gyroX: props.gyroX,
                    gyroY: props.gyroY,
                    gyroZ: props.gyroZ,
                    dark: props.dark,
                    time: props.vehicleClock
                }
            }
            else {
                return {
                    gyroX: props.gyroX,
                    gyroY: props.gyroY,
                    gyroZ: props.gyroZ,
                    dark: props.dark,
                    time: props.vehicleClock
                }
            }
        }

        return null
    }
    
    
        
    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="SystemPanel" style={{position: "relative", width: "100%", height: "100%"}}>
                    <h3>Gyroscope</h3>
                    <hr/>
                    <div className="subpanel" style={{display: "inline-block", height: "80%", margin: "0px 0px 0px 5px"}}>
                        <div className="row">
                            <div style={{display: "inline-block", textAlign: "center", margin: "0px 0px 0px 10px", position:"relative"}}>
                                <h3>Pitch (X)</h3>
                                <CGauge
                                    input={Math.abs(this.state.gyroX)}
                                    reverse={ this.state.gyroX < 0} 
                                    dark={this.state.dark}
                                />
                            </div>
                            <div style={{display: "inline-block", margin: "0px 0px 0px 0px", textAlign: "center", position: "relative"}}>
                                <h3>Roll (Y)</h3>
                                <RPMGauge input={this.state.gyroY} dark={this.state.dark} unit={this.state.unit} digits={this.state.digits}/>

                            </div>
                            <div style={{display: "inline-block", margin: "0px 10px 0px 0px", textAlign: "center", position:"relative"}}>
                                <h3>Yaw (Z)</h3>
                                <CGauge
                                    input={Math.abs(this.state.gyroZ)}
                                    reverse={ this.state.gyroZ < 0} 
                                    dark={this.state.dark}
                                />
                            </div>
                        </div>
                        {/* <div style={{display: "inline-block", textAlign: "center", margin: "0px 10px 0px 0px"}}>
                            <h3>Roll (Z)</h3>
                            <CircularGauge
                                value={Math.abs(this.state.gyroZ)}
                                colors={colors}
                                transitions={true}
                                centerRender={circCenterRenderer}
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

                        </div> */}
                    </div>
                    
                    {/* <div className="subpanel" style={{width: "70%", position: "absolute", right: 0, bottom: 0}}>
                        <LiveSplineChart
                                data0={this.state.data0} name0="X"
                                data1={this.state.data1} name1="Y"
                                data2={this.state.data2} name2="Z"
                                datanum={this.props.timeScale} 
                                title={this.props.title} />
                    </div> */}
                </div>
            </div>
        );
    }
}
