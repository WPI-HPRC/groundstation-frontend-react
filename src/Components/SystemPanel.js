import React from 'react';


export default class SystemPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            accelX: 0,
            accelY: 0,
            accelZ: 0
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.accelX !== props.accelX ||
            current_state.accelY !== props.accelY ||
            current_state.accelZ !== props.accelZ) {

            return {
                accelX: props.accelX,
                accelY: props.accelY,
                accelZ: props.accelZ
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

                </div>
            </div>
        );
    }
}
