import React from 'react';

export default class BarSignalIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signalStrength: props.signalStrength,
            dark: props.dark,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if(current_state.dark !== props.dark)
        {
            return {
                dark: props.dark,
            }
        }
    }

    render() {

        // calculations for the bars

        let radius = 20;
        let circumference = 2 * radius * Math.PI;

        let scaleFactor1 = 0.68;
        let scaleFactor2 = 0.55;

        let percent = 110/360; // 90 degrees
        let outerArcLength = percent * circumference;
        let middleArcLength = percent * scaleFactor1 * circumference;
        let innerArcLength = percent * scaleFactor1 * scaleFactor2 * circumference;

        let darrayOuter = `${outerArcLength} ${circumference}`
        let darrayMiddle = `${middleArcLength} ${circumference}`
        let darrayInner = `${innerArcLength} ${circumference}`

        // transform

        let transform = "rotate(215, 30, 30)"

        // calculations for the color of the icon.  
        // start color: 43 171 58
        // 75%: 143 171 43
        // 50%: 171 126 43
        // 25%: 171 58 43
        // 0%: 59 9 3

        // the 'no signal' color --> used for bars that aren't colored & when there's no signal, in addition to the strikethrough
        // light mode --> #607d8b
        // dark mode --> #212121

        let color1 = 43;
        let color2 = 171;
        let color3 = 58;

        let fill1 = true;
        let fill2 = true;
        let fill3 = true;
        let fill4 = true;

        if(this.state.signalStrength > 0.75) { // from 0.75 to 1 & technically above, but that shouldn't happen !Dan/Paige
            let adjustedPercent = 1 - ((this.state.signalStrength - 0.75) / 0.25);
            // diff = +100 +0 -15
            color1 += 100 * adjustedPercent;
            color2 += 0 * adjustedPercent;
            color3 -= 15 * adjustedPercent;
        } else if (this.state.signalStrength > 0.5) { // from 0.5 to 0.75
            let adjustedPercent = 1 - (this.state.signalStrength - 0.5) / 0.25;
            color1 = 143;
            color2 = 171;
            color3 = 43;
            // diff = +28 -45 +0
            color1 += 28 * adjustedPercent;
            color2 -= 45 * adjustedPercent;
            color3 += 0 * adjustedPercent;

            fill1 = false;
        } else if (this.state.signalStrength > 0.25) { // from 0.25 to 0.5
            let adjustedPercent = 1 - (this.state.signalStrength - 0.25) / 0.25;
            color1 = 171;
            color2 = 126;
            color3 = 43;
            // diff = +0 -68 +0
            color1 += 0 * adjustedPercent;
            color2 -= 68 * adjustedPercent;
            color3 += 0 * adjustedPercent;
             
            fill1 = false;
            fill2 = false;
        } else if (this.state.signalStrength > 0) { // basically no signal
            let adjustedPercent = 1 - (this.state.signalStrength) / 0.25;
            color1 = 171;
            color2 = 58;
            color3 = 43;
            // diff = -112 -49 -40
            color1 -= 112 * adjustedPercent;
            color2 -= 49 * adjustedPercent;
            color3 -= 40 * adjustedPercent;

            fill1 = false;
            fill2 = false;
            fill3 = false;
        } else { // no signal
            if(this.props.dark){
                color1 = 21;
                color2 = 21;
                color3 = 21;
            } else {
                color1 = 96;
                color2 = 125;
                color3 = 139;
            }
            fill1 = false;
            fill2 = false;
            fill3 = false;
            fill4 = false;
        }

        let color = `rgb(${color1}, ${color2}, ${color3})`;

        return (
            <svg width="60" height="50">

                <rect x="40" y="00" width="7" height="35" fill={fill1 ? color : this.state.dark ? "#ffffff" : "#607d8b"} />
                <rect x="30" y="10" width="7" height="25" fill={fill2 ? color : this.state.dark ? "#ffffff" : "#607d8b"} />
                <rect x="20" y="20" width="7" height="15" fill={fill3 ? color : this.state.dark ? "#ffffff" : "#607d8b"} />
                <rect x="10" y="30" width="7" height="5" fill={fill4 ? color : this.state.dark ? "#ffffff" : "#607d8b"} />


                <line /* strikethrough "transparent" background */ x1="15" y1="36" x2="49" y2="5" strokeWidth={7} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.dark ? "#212121" : "#e0e0e0"} strokeLinecap={"round"}/>
                <line /* strikethrough main line */ x1="12" y1="39" x2="51" y2="3" strokeWidth={3} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.dark ? "white" : "#607d8b"} strokeLinecap={"round"}/>
            </svg>
        )
    }
}