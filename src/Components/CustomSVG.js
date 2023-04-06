import React from 'react';

/*
*
*  This class contains all the custom SVG elements for the ground station
*  at the moment, that is:
*    - PowerLossWarningIndicator
*    - AirbrakesIndicator
*    - BarSignalIcon
*    - BatteryIcon
*    - SignalIcon
*    - Gauge
*    - RPMGauge
*    - CGauge
*  
*/

export class PowerLossWarningIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            powerLossWarning: props.powerLossWarning,
            dark: props.dark,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if(current_state.powerLossWarning !== props.powerLossWarning ||
            current_state.dark !== props.dark) {
            update = {
                powerLossWarning: props.powerLossWarning, // power loss warning
                dark: props.dark, // update dark/light state
            }
        }

        return update;
    }

    render() {

        let circumference = Math.PI * 100 * 2;
        let dashArrayArrow = `${0.75 * circumference}, ${circumference}`;

        return(
            <svg width="100%" height="100%" viewBox="0 0 300 300">
                <circle strokeDasharray={dashArrayArrow} cx="150" cy="150" r="100" fill="transparent" strokeWidth="20" stroke={this.state.dark ? this.state.powerLossWarning ? "red" : "#ffffff" : this.state.powerLossWarning ? "red" : "#607d8b"}/>
                <rect strokeWidth="15" x="90" y="125" width="120" height="50" rx="10" fill="transparent" stroke={this.state.dark ? this.state.powerLossWarning ? "red" : "#ffffff" : this.state.powerLossWarning ? "red" : "#607d8b"} style={{transition: "x 1s"}}></rect>
                <rect strokeWidth="15" x="210" y="140" width="10" height="20" rx="10" fill="transparent" stroke={this.state.dark ? this.state.powerLossWarning ? "red" : "#ffffff" : this.state.powerLossWarning ? "red" : "#607d8b"} style={{transition: "x 1s"}}></rect>
                <line x1="100" y1="185" x2="200" y2="115" strokeWidth="40" strokeLinecap="round" stroke={this.state.dark ? "#212121" : "#607d8b"}></line>
                <line x1="100" y1="185" x2="200" y2="115" strokeWidth="15" strokeLinecap="round" stroke={this.state.dark ? this.state.powerLossWarning ? "red" : "#ffffff" : this.state.powerLossWarning ? "red" : "#607d8b"}></line>
                <polygon points="150,20 210,50 150,80" fill={this.state.dark ? this.state.powerLossWarning ? "red" : "#ffffff" : this.state.powerLossWarning ? "red" : "#607d8b"}/>
            </svg>

        );
    }
}

export default class AirbrakesIndicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            airbrakesDeploy: props.airbrakesDeploy,
            dark: props.dark,
        }
    }

    /* check if any conditions have updated, in order to change the state */

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if(current_state.airbrakesDeploy !== props.airbrakesDeploy ||
            current_state.dark !== props.dark) {
            update = {
                airbrakesDeploy: props.airbrakesDeploy, // update airbrakes deployment %
                dark: props.dark, // update dark/light state
            }
        }

        return update;
    }

    render() {

        /* doing some math to create some of the parts needed later */ 
        let circumference = 60 * 2 * Math.PI; // circumference of the outer circle
        let innerArc = circumference * (45 /360); // the background color arc in the arms of the airbrakes 
        
        /* the dash arrays are used to define arcs along circles */
        let dA = `85 ${circumference}`; // the dash array for the arms
        let dAPT = `0 ${circumference}`; // the 'dot' in the center of the arms which moves
        let dAI = `${innerArc} ${circumference}`; // the dash array for the 'background' of the arms

        /* calculating the offset angles for each arm */
        let angle0 = 70 - 20 * (this.state.airbrakesDeploy / 100);
        let angle1 = 160 - 20 * (this.state.airbrakesDeploy / 100);
        let angle2 = 250 - 20 * (this.state.airbrakesDeploy / 100);
        let angle3 = 340 - 20 * (this.state.airbrakesDeploy / 100);

        /* scale of the entire indicator */ 
        let scale = 0.55
        let height = 180 * scale;
        let width = 250 * scale;

        /* rotating each of the arms about the center of the indicator */ 
        let transform0 = `rotate(${angle0}, 125, 90)`;
        let transform1 = `rotate(${angle1}, 125, 90)`;
        let transform2 = `rotate(${angle2}, 125, 90)`;
        let transform3 = `rotate(${angle3}, 125, 90)`;


        /* transform for how far the dot is rotated about the center of the invisible circle that the arms are arcs of */
        let preTransform = `rotate(${40 + 47*(this.state.airbrakesDeploy/100)}, ${125 - width/2.5}, 90)`;

        /* transform for the inside portion of the arc */
        let insideTransform = `rotate(39, ${125 - width/2.5}, 90)`

        /* x positions of the fins of the airbrakes (aka how extended they are) */
        /* since the fins are positioned on the right side, extended to how far */
        /* they need to be, then rotated about the center of the indicator */ 
        let x1 = 150 + (50 * scale) * (this.state.airbrakesDeploy / 100);



        return(
            <svg width="100%" height="100%" viewBox="0 0 250 180">
                <g transform={`rotate(45, 125, 90)`}>

                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 1s"}}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 1s"}} transform={`rotate(90, 125, 90)`}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 1s"}} transform={`rotate(180, 125, 90)`}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 1s"}} transform={`rotate(270, 125, 90)`}/>


                    <circle cx="125" cy="90" r="70" fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={5}></circle>
                    
                    <g /* arm 1 */ transform={transform0} style={{transition: "transform 1s"}}>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={insideTransform} fill="transparent" stroke={this.state.dark ? "#212121" : "#E0E0E0"} strokeWidth={8} strokeDasharray={dAI} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={preTransform} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={6} strokeDasharray={dAPT} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                    </g>

                    <g /* arm 2 */ transform={transform1} style={{transition: "transform 1s"}}>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={insideTransform} fill="transparent" stroke={this.state.dark ? "#212121" : "#E0E0E0"} strokeWidth={8} strokeDasharray={dAI} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={preTransform} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={6} strokeDasharray={dAPT} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                    </g>
                    <g /* arm 3 */transform={transform2} style={{transition: "transform 1s"}}>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={insideTransform} fill="transparent" stroke={this.state.dark ? "#212121" : "#E0E0E0"} strokeWidth={8} strokeDasharray={dAI} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={preTransform} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={6} strokeDasharray={dAPT} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                    </g>
                    <g /* arm 4 */ transform={transform3} style={{transition: "transform 1s"}}>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={insideTransform} fill="transparent" stroke={this.state.dark ? "#212121" : "#E0E0E0"} strokeWidth={8} strokeDasharray={dAI} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                        <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={preTransform} fill="transparent" stroke={this.state.dark ? "white" : "#607d8b"} strokeWidth={6} strokeDasharray={dAPT} strokeLinecap={"round"} style={{transition: "transform 1s"}}/>
                    </g>
                    
                    <circle cx={125} cy={90} r="30" fill={this.state.dark ? "white" : "#607d8b"}/>

                </g>
            </svg>
        )
    }
}

/* 
* The icon showing the recieved signal strength from the 3 sensor cubes
*/

export class BarSignalIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signalStrength: props.signalStrength, // the signal strength to display on the diagram
            dark: props.dark, // whether to be in light or dark color scheme
        }
    }

    /* check anything that can change & needs to be updated live 
    *
    * in this case, that's just the dark/light toggle and the signal strength
    *
    */
     
    static getDerivedStateFromProps(props, current_state) {

        let update = null;

        if(current_state.dark !== props.dark || 
            current_state.signalStrength !== props.signalStrength)
        {
            update = {
                dark: props.dark,
                signalStrength: props.signalStrength,
            }
        }
        return update;
    }

    render() {

        // calculations for the bars of the WI-FI symbol version of this icon

        // let radius = 20;
        // let circumference = 2 * radius * Math.PI;

        // let scaleFactor1 = 0.68;
        // let scaleFactor2 = 0.55;

        // let percent = 110/360; // 90 degrees
        // let outerArcLength = percent * circumference; 
        // let middleArcLength = percent * scaleFactor1 * circumference; 
        // let innerArcLength = percent * scaleFactor1 * scaleFactor2 * circumference;


        // calculations for the color of the icon.  
        // start color: 43 171 58
        // 75%: 143 171 43
        // 50%: 171 126 43
        // 25%: 171 58 43
        // 0%: 59 9 3

        // the 'no signal' color --> used for bars that aren't colored & when there's no signal, in addition to the strikethrough
        // light mode --> #607d8b
        // dark mode --> #212121

        let color1 = 43; //  R
        let color2 = 171; // G
        let color3 = 58; //  B

        let fill1 = true; // fill bar 1 when signal > 75
        let fill2 = true; // fill bar 2 when signal > 50
        let fill3 = true; // fill bar 3 when signal > 25
        let fill4 = true; // fill bar 4 unless no signal

        if(this.state.signalStrength > 0.75) { // from 0.75 to 1 & technically above, but that shouldn't happen !Dan/Paige
            let adjustedPercent = 1 - ((this.state.signalStrength - 0.75) / 0.25);
            // color delta values
            // diff = +100 +0 -15
            // apply these to the start color to create a good gradient from start to end color
            // same for other cases below
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
        } else if (this.state.signalStrength > 0) { // less than 0.25
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
                color1 = 21; // set the colors to the background color
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

        // creating the color of the bars that are filled using the colors defined above
        let color = `rgb(${color1}, ${color2}, ${color3})`;

        return (
            <svg width="60" height="50">

                <rect x="40" y="00" width="7" height="35" fill={fill1 ? color : this.props.dark ? "#ffffff" : "#607d8b"} />
                <rect x="30" y="10" width="7" height="25" fill={fill2 ? color : this.props.dark ? "#ffffff" : "#607d8b"} />
                <rect x="20" y="20" width="7" height="15" fill={fill3 ? color : this.props.dark ? "#ffffff" : "#607d8b"} />
                <rect x="10" y="30" width="7" height="5" fill={fill4 ? color : this.props.dark ? "#ffffff" : "#607d8b"} />


                <line /* strikethrough "transparent" background */ x1="15" y1="36" x2="49" y2="5" strokeWidth={7} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.dark ? "#212121" : "#e0e0e0"} strokeLinecap={"round"}/>
                <line /* strikethrough main line */ x1="12" y1="39" x2="51" y2="3" strokeWidth={3} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.dark ? "white" : "#607d8b"} strokeLinecap={"round"}/>
            </svg>
        )
    }
}

/*
* This icon is currently not in use, as we do not have a way of detecting payload cube battery voltage
*/


export class BatteryIcon extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            batteryPercent: 0.5,
            dark: this.props.dark,
        }
    }


    /* This icon requires the battery percentage and the dark/light colors to be live updated */
    static getDerivedStateFromProps(props, current_state) {
        let update = null;
        if(current_state.batteryPercent !== props.batteryPercent ||
        current_state.dark !== props.dark) {
            update = {
                dark: props.dark, // the light/dark state of the UI
                batteryPercent: props.batteryPercent, // the percent of the battery on this cube
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

        let color1 = 43; // this is the same color gradient used in BarSignalIcon
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

        } else if (this.state.batteryPercent > 0) { // less than 0.25
            let adjustedPercent = 1 - (this.state.batteryPercent) / 0.25;
            color1 = 171;
            color2 = 58;
            color3 = 43;
            // diff = -112 -49 -40
            color1 -= 112 * adjustedPercent;
            color2 -= 49 * adjustedPercent;
            color3 -= 40 * adjustedPercent;
        }
        // creating the colors based on the earlier defined values
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

// this function handles converting incoming float data to the correct format

function padLeadingZeros(num, size) {

    if(num % 1 === 0) // first, check if it is a round number, and add leading zeroes to make it the correct digits as specified by 'size'
    {
        if(num >= 0) {
            var s = num+"";
            while (s.length < size) s = "0" + s;
        } else { // if the number is negative, be sure to put the negative sign in front of the new zeroes
            var s = Math.abs(num)+"";
            while (s.length < size) s = "0" + s;
            s = "-" + s; 
        }
        
        return s;
    } else if(size === 3) { // this section is very much brute-forced and relies on the data being <4 digits 
        var rounded = 0;    // TODO
        if(num > 99) {
            rounded = Math.round(num);
        } else if(num > 9) {
            rounded = Math.round(num * 10.0)/10.0;
        } else {
            rounded = Math.round(num * 100.0)/100.0;
        }
        return rounded;

    } else if(size === 4) {
        var rounded = 0;
        if(num > 999) {
            rounded = Math.round(num);
        }
        else if(num > 99) {
            rounded = Math.round(num * 10.0)/10.0;
        } else if(num > 9) {
            rounded = Math.round(num * 100.0)/100.0;
        } else {
            rounded = Math.round(num * 1000.0)/1000.0;
        }
        return rounded;
    }




    
}

export class Gauge extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: props.input,
            dark: props.dark,
            // val0: props.val0,
            // digits: props.digits,
        }
    }

    static getDerivedStateFromProps(props, current_state) { // update the data if UI state or input changes
        let update = null;

        if(current_state.input !== props.input ||
            current_state.dark !== props.dark) {
            update = {
                input: props.input,
                dark:props.dark,
            }
        }
        return update;
    }

    render() {

        // calculate the size of the gauge's circle for use later
        let radius = 100;
        let circumference = 2 * radius * Math.PI;
        let arcLength = 0.75 * circumference;

        // dash array for the arc of the gauge
        let dashArray = `${arcLength} ${circumference}`;
        let transform = `rotate(135, 150, 106)`; // rotate the dash array so the origin is at the correct angle

        // these define the gauge's scale.  should probably be changed to be variable at some point
        let max = 9999;
        let min = 0;

        // calculate what fraction of the gauge is filled
        let percent = 0;
        if(this.state.input <= max && this.state.input >= min) { // edge case handling
            percent = this.state.input / max;
        }

        // the 'filled' arc of the gauge - its the same code as above but shorter (usually) and drawn over the first arc
        let topArcLength = arcLength * percent;
        let dashArray2 = `${topArcLength} ${circumference}`;

        // color gradient from grey to orange
        // for an example of other colors see BarSignalIcon and BatteryIcon
        let color1 = 48 + 189 * percent; // R
        let color2 = 48 + 32 * percent;  // G
        let color3 = 48 + 1 * percent;   // B
        let color = `rgb(${color1}, ${color2}, ${color3})`;


        // if the gauge reads zero, hide the top arc so it does not show a (zero + radius width) circle on the gauge
        if(this.state.input == 0) {
            color = "transparent";
        }


        return(

            <div style={{textAlign: "center", height:"100%", width:"100%"}}>
                <svg width="100%" height="100%" viewBox="0,0,300,206">
                    <circle cx="150" cy="106" /* base arc */
                        r={radius} 
                        fill="transparent" 
                        stroke={this.state.dark ? "white" : "#607d8b"} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArray} 
                        transform={transform}
                        strokeLinecap="round"
                    />
                    <circle cx="150" cy="106" /* fill arc */
                        r={radius} 
                        fill="transparent" 
                        stroke={color} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArray2} 
                        transform={transform}
                        strokeLinecap="round"
                        style={{transition: "stroke-dasharray 0.3s, stroke 0.3s"}}
                    />

                   

                </svg>
                <div /* data in the center of the gauge */ style={{textAlign: "center", width: "100%", height:"100%", position:"absolute", bottom:"-40%"}}>
                    <h4>{this.props.unit}</h4>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "3.5em"}}>{padLeadingZeros(parseInt(this.state.input), this.props.digits)}</h4>
                </div>
            </div>

        );
    }

}

// gauge for displaying the rotation of the rocket 
// specifically, the center one using RPM rather than DPS
export class RPMGauge extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: props.input,
            dark: props.dark,
            // val0: props.val0,
            // digits: props.digits,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if(current_state.input !== props.input ||
            current_state.dark !== props.dark) {
            update = {
                input: props.input,
                dark:props.dark,
            }
        }

        return update;
    }

    render() {

        // most things are the same as Gauge, just different units
        let radius = 100;
        let circumference = 2 * radius * Math.PI;
        let arcLength = 0.75 * circumference;

        let dashArray = `${arcLength} ${circumference}`;
        let transform = `rotate(135, 150, 106)`;

        let max = 9999;
        let min = 0;

        let percent = 0;


        if(this.state.input <= max && this.state.input >= min) {
            percent = this.state.input / max;
        }

        let topArcLength = arcLength * percent;
        let dashArray2 = `${topArcLength} ${circumference}`;

        let color1 = 48 + 189 * percent;
        let color2 = 48 + 32 * percent;
        let color3 = 48 + 1 * percent;

        let color = `rgb(${color1}, ${color2}, ${color3})`;

        if(this.state.input === 0) {
            color = "transparent";
        }


        return(

            <div style={{textAlign: "center", width: "100%", height: "100%"}}>
                <svg width="100%" height="70%" viewBox="0,0,300,206">
                    <circle cx="150" cy="106" 
                        r={radius} 
                        fill="transparent" 
                        stroke={this.state.dark ? "white" : "#607d8b"} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArray} 
                        transform={transform}
                        strokeLinecap="round"
                    />
                    <circle cx="150" cy="106" 
                        r={radius} 
                        fill="transparent" 
                        stroke={color} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArray2} 
                        transform={transform}
                        strokeLinecap="round"
                        style={{transition: "stroke-dasharray 0.3s, stroke 0.3s"}}
                    />

                   

                </svg>
                <div style={{textAlign: "center", width: "100%", position:"absolute", top: "13vh"}}>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "6vh", marginBottom: "10px"}}>{padLeadingZeros(this.state.input, 3)}</h4>
                    <h4 style={{fontSize: "2.5vh", fontWeight: "400"}}>{this.props.unit}</h4>
                </div>
            </div>

        );
    }

}

// the two circular gauges next to the RPMGauge
export class CGauge extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: props.input,
            dark: props.dark,
            reverse: props.reverse, // is the gauge going left?
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;
        if(current_state.input !== props.input ||
            current_state.dark !== props.dark ||
            current_state.reverse !== props.reverse) {
            update = {
                input: props.input,
                dark: props.dark,
                reverse: props.reverse,
            }
        }
        return update;
    }

    render() {

        // the main arc does not need a dash array because it is a full circle
        // the way dash arrays work is that they define how long a dash is and how often it repeats
        // thus a dash array of 1, circumference would create a 1-pixel long arc at 1 point
        // but 1, c/4 would create four of them evenly spaced
        let radius = 90;
        let circumference = 2 * radius * Math.PI;
        let arcLength = 1 * circumference;

        let max = 360;
        let min = 0;

        let percent = 0;

        if(this.state.input <= max && this.state.input >= min) {
            percent = this.state.input / max;
        }

        // we have two dash arrays here, one for 'forward' and one for 'backward'
        // this helps with animation, since it means both can be being animated at once so
        // they don't flicker or jump
        let topArcLengthDis1 = arcLength * percent;
        if(this.state.reverse)
        {
            topArcLengthDis1 = 0;
        }
        let dashArrayDis1 = `${topArcLengthDis1} ${circumference}`;

        let topArcLengthDis2 = arcLength * percent;
        if(!this.state.reverse)
        {
            topArcLengthDis2 = 0;

        }

        let dashArrayDis2 = `${topArcLengthDis2} ${circumference}`;

        let color1 = 48 + 189 * percent;
        let color2 = 48 + 32 * percent;
        let color3 = 48 + 1 * percent;

        let color = `rgb(${color1}, ${color2}, ${color3})`;

        if(this.state.input === 0) {
            color = "transparent";
        }

        return(

            <div style={{textAlign: "center", width: "100%", height: "100%"}}>
                <svg width="100%" height="70%" viewBox="0,0,300,212">
                    <circle cx="150" cy="106" 
                        r={radius} 
                        fill="transparent" 
                        stroke={this.state.dark ? "white" : "#607d8b"} 
                        strokeWidth={"11"} 
                        // transform={transform}
                        strokeLinecap="round"
                    />
                    <circle cx="150" cy="106" 
                        r={radius} 
                        fill="transparent" 
                        stroke={color} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArrayDis1} 
                        strokeLinecap="round"
                        style={{transition: "stroke-dasharray 0.3s, stroke 0.3s"}}
                        className={"cGauge"}
                    />
                    <circle cx="150" cy="106" 
                        r={radius} 
                        fill="transparent" 
                        stroke={color} 
                        strokeWidth={"11"} 
                        strokeDasharray={dashArrayDis2} 
                        strokeLinecap="round"
                        style={{transition: "stroke-dasharray 0.3s, stroke 0.3s"}}
                        className={"cGaugeRev"}
                    />

                   

                </svg>
                <div style={{textAlign: "center", width: "100%", position:"absolute", top: "14vh"}}> 
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "5vh", marginBottom: "10px"}}>{padLeadingZeros(this.state.input, 3)}</h4>
                    <h4 style={{fontSize:"2.5vh", fontWeight: "400"}}>dps</h4>
                </div>
            </div>

        );
    }

}

// alternative version of BarSignalIcon which looks like a wi-fi symbol
export class SignalIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signalStrength: props.signalStrength,
            dark: props.dark,
            color: props.color,
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
            <svg width="60" height="40">
                <circle cx="30" cy="30" r={radius} fill="transparent" stroke={fill1 ? color : this.props.color} strokeWidth={3} strokeDasharray={darrayOuter} transform={transform} strokeLinecap={"round"}/>
                <circle cx="30" cy="30" r={radius * scaleFactor1} fill="transparent" stroke={fill2 ? color : this.props.color} strokeWidth={3} strokeDasharray={darrayMiddle} transform={transform} strokeLinecap={"round"}/>
                <circle cx="30" cy="30" r={radius * scaleFactor1 * scaleFactor2} fill="transparent" stroke={fill3 ? color : this.props.color} strokeWidth={3} strokeDasharray={darrayInner} transform={transform} strokeLinecap={"round"}/>
                <circle cx="30" cy="30" fill={fill4 ? color : this.props.color} r={radius * scaleFactor1 * scaleFactor2 * 0.4}></circle>
                <line x1="15" y1="32" x2="49" y2="5" strokeWidth={8} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.dark ? "#212121" : "#e0e0e0"} strokeLinecap={"round"}/>
                <line x1="17" y1="30" x2="46" y2="8" strokeWidth={3} stroke={this.state.signalStrength !== 0 ? "transparent" : this.props.color} strokeLinecap={"round"}/>
            </svg>
        )
    }
}