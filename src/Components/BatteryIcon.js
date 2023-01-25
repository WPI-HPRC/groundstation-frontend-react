import React from 'react';

export default class BatteryIcon extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            batteryPercent: 0.5,
            dark: this.props.dark,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;
        if(current_state.batteryPercent !== props.batteryPercent ||
        current_state.dark !== props.dark) {
            update = {
                dark: props.dark,
                batteryPercent: props.batteryPercent,
            }
        }
        return update;
    }

    render() {

        // length of inside bar

        let baseLength = 40;
        let adjLength = baseLength * this.state.batteryPercent;

        // color of inside bar.  Note no contingency for zero - if battery is zero, we won't be getting signal anyway so no way to tell
        // how convenient I already have code to seamlessly change color from 1 --> 0

        let color1 = 43;
        let color2 = 171;
        let color3 = 58;

        if(this.state.batteryPercent > 0.75) { // from 0.75 to 1 & technically above, but that shouldn't happen !Dan/Paige
            let adjustedPercent = 1 - ((this.state.batteryPercent - 0.75) / 0.25);
            // diff = +100 +0 -15
            color1 += 100 * adjustedPercent;
            color2 += 0 * adjustedPercent;
            color3 -= 15 * adjustedPercent;
        } else if (this.state.batteryPercent > 0.5) { // from 0.5 to 0.75
            let adjustedPercent = 1 - (this.state.batteryPercent - 0.5) / 0.25;
            color1 = 143;
            color2 = 171;
            color3 = 43;
            // diff = +28 -45 +0
            color1 += 28 * adjustedPercent;
            color2 -= 45 * adjustedPercent;
            color3 += 0 * adjustedPercent;

        } else if (this.state.batteryPercent > 0.25) { // from 0.25 to 0.5
            let adjustedPercent = 1 - (this.state.batteryPercent - 0.25) / 0.25;
            color1 = 171;
            color2 = 126;
            color3 = 43;
            // diff = +0 -68 +0
            color1 += 0 * adjustedPercent;
            color2 -= 68 * adjustedPercent;
            color3 += 0 * adjustedPercent;

        } else if (this.state.batteryPercent > 0) { // basically no battery
            let adjustedPercent = 1 - (this.state.batteryPercent) / 0.25;
            color1 = 171;
            color2 = 58;
            color3 = 43;
            // diff = -112 -49 -40
            color1 -= 112 * adjustedPercent;
            color2 -= 49 * adjustedPercent;
            color3 -= 40 * adjustedPercent;
        }

        let color = `rgb(${color1}, ${color2}, ${color3})`;


        return (
            <svg height="40" width="70">
                <rect height="25" width="50" rx="5" y="12" x="5" fill="transparent" stroke={this.state.dark ? "#ffffff" : "#607d8b"} strokeWidth={3}></rect>
                <rect height="9" width="5" rx="5" y="20" x="55" fill={this.state.dark ? "#ffffff" : "#607d8b"} stroke={this.state.dark ? "#ffffff" : "#607d8b"} strokeWidth={3}></rect>
                <rect height="15" width={adjLength} y="17" x="10" fill={color}></rect>

            </svg>
        )
    }

}