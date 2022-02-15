import React from 'react';
import LiveSplineChart from './LiveSplineChart';


export default class SystemPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            accelX: 0,
            accelY: 0,
            accelZ: 0,
            dataX: [],
            dataY: [],
            dataZ: [],
            time: props.vehicleClock
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.accelX !== props.accelX ||
            current_state.accelY !== props.accelY ||
            current_state.accelZ !== props.accelZ ||
            current_state.time !== props.vehicleTime) {

            return {
                accelX: props.accelX,
                accelY: props.accelY,
                accelZ: props.accelZ,
                dataX: [...current_state.dataX.slice(props.timeScale * -1.1), [props.vehicleClock.getTime(), props.accelX]],
                dataY: [...current_state.dataY.slice(props.timeScale * -1.1), [props.vehicleClock.getTime(), props.accelY]],
                dataZ: [...current_state.dataZ.slice(props.timeScale * -1.1), [props.vehicleClock.getTime(), props.accelZ]],
            }
        }

        return null
    }
    
    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="SystemPanel" style={{position: "relative", width: "100%", height: "100%"}}>
                    <h3>System</h3>
                    <hr/>
                    AccelX: {this.state.accelX}<br/>
                    AccelY: {this.state.accelY}<br/>
                    AccelZ: {this.state.accelZ}<br/>

                    <div style={{width: "50%", position: "absolute", right: 0, bottom: 0}}>
                        {/* <LiveSplineChart
                                data={this.state.dataX}
                                datanum={this.props.datanum} 
                                title={this.props.title} />  */}
                    </div>
                </div>
            </div>
        );
    }
}
