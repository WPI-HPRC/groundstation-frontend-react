import React from 'react';
import LiveSplineChart from './LiveSplineChart';


export default class SystemPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            gyroX: 0,
            gyroY: 0,
            gyroZ: 0,
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
                    time: props.vehicleClock
                }
            }
            else {
                return {
                    gyroX: props.gyroX,
                    gyroY: props.gyroY,
                    gyroZ: props.gyroZ,
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
                    <h3>System</h3>
                    <hr/>
                    gyroX: {this.state.gyroX}<br/>
                    gyroY: {this.state.gyroY}<br/>
                    gyroZ: {this.state.gyroZ}<br/>

                    <img src='rocket.png' style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", transform: "rotate(0.80turn)"}}/>
                </div>
            </div>
        );
    }
}
