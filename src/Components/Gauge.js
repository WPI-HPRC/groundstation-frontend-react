import React from 'react';

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export default class Gauge extends React.Component {

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
        if(current_state.input !== props.input ||
            current_state.dark !== props.dark) {
            return {
                input: props.input,
                dark:props.dark,
            }
        }
    }

    render() {

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

        if(this.state.input == 0) {
            color = "transparent";
        }


        return(

            <div style={{textAlign: "center"}}>
                <svg width="300" height="206">
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
                <div style={{textAlign: "center", width: "100%", position:"absolute", bottom: "-2vh"}}>
                    <h4>{this.props.unit}</h4>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "3.5em"}}>{padLeadingZeros(parseInt(this.state.input), this.props.digits)}</h4>
                </div>
            </div>

        );
    }

}

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
        if(current_state.input !== props.input ||
            current_state.dark !== props.dark) {
            return {
                input: props.input,
                dark:props.dark,
            }
        }
    }

    render() {

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

        if(this.state.input == 0) {
            color = "transparent";
        }


        return(

            <div style={{textAlign: "center"}}>
                <svg width="300" height="206">
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
                <div style={{textAlign: "center", width: "100%", position:"absolute", top: "11vh"}}>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "3.5em", marginBottom: "10px"}}>{padLeadingZeros(parseInt(this.state.input), this.props.digits)}</h4>
                    <h4 style={{fontSize: "1.5em", fontWeight: "400"}}>{this.props.unit}</h4>
                </div>
            </div>

        );
    }

}

export class CGaugeR extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: props.input,
            dark: props.dark,
            reverse: props.reverse,
            dis1: props.dis1,
            dis2: props.dis2,
            // val0: props.val0,
            // digits: props.digits,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if(current_state.input !== props.input ||
            current_state.dark !== props.dark ||
            current_state.reverse !== props.reverse ||
            current_state.dis1 !== props.dis1 ||
            current_state.dis2 !== props.dis2) {
            return {
                input: props.input,
                dark: props.dark,
                reverse: props.reverse,
                dis1: props.dis1,
                dis2: props.dis2,
            }
        }
    }

    render() {

        let radius = 90;
        let circumference = 2 * radius * Math.PI;
        let arcLength = 1 * circumference;

        let max = 360;
        let min = 0;

        let percent = 0;

        let show1 = false;
        let show2 = false;

        if(this.state.input <= max && this.state.input >= min) {
            percent = this.state.input / max;
        }

        let topArcLengthDis1 = arcLength * percent;
        if(this.state.reverse)
        {
            topArcLengthDis1 = 0;
            show1 = false;
            show2 = true;
            
        }
        let dashArrayDis1 = `${topArcLengthDis1} ${circumference}`;

        let topArcLengthDis2 = arcLength * percent;
        if(!this.state.reverse)
        {
            topArcLengthDis2 = 0;
            show1 = true;
            show2 = false;
        }

        if(this.state.input == 0) {
            show1 = false;
            show2 = false;
        }
        let dashArrayDis2 = `${topArcLengthDis2} ${circumference}`;

        let color1 = 48 + 189 * percent;
        let color2 = 48 + 32 * percent;
        let color3 = 48 + 1 * percent;

        let color = `rgb(${color1}, ${color2}, ${color3})`;

        if(this.state.input == 0) {
            color = "transparent";
        }

        return(

            <div style={{textAlign: "center"}}>
                <svg width="300" height="212">
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
                <div style={{textAlign: "center", width: "100%", position:"absolute", top: "18vh", right: "-15.4vw"}}>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "2.5em", marginBottom: "10px"}}>{padLeadingZeros(parseInt(this.state.input), 3)}</h4>
                    <h4 style={{fontSize:"1.5em", fontWeight: "400"}}>dps</h4>
                </div>
            </div>

        );
    }

}

export class CGaugeL extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: props.input,
            dark: props.dark,
            reverse: props.reverse,
            dis1: props.dis1,
            dis2: props.dis2,
            // val0: props.val0,
            // digits: props.digits,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if(current_state.input !== props.input ||
            current_state.dark !== props.dark ||
            current_state.reverse !== props.reverse ||
            current_state.dis1 !== props.dis1 ||
            current_state.dis2 !== props.dis2) {
            return {
                input: props.input,
                dark: props.dark,
                reverse: props.reverse,
                dis1: props.dis1,
                dis2: props.dis2,
            }
        }
    }

    render() {

        let radius = 90;
        let circumference = 2 * radius * Math.PI;
        let arcLength = 1 * circumference;

        let max = 360;
        let min = 0;

        let percent = 0;

        let show1 = false;
        let show2 = false;

        if(this.state.input <= max && this.state.input >= min) {
            percent = this.state.input / max;
        }

        let topArcLengthDis1 = arcLength * percent;
        if(this.state.reverse)
        {
            topArcLengthDis1 = 0;
            show1 = false;
            show2 = true;
            
        }
        let dashArrayDis1 = `${topArcLengthDis1} ${circumference}`;

        let topArcLengthDis2 = arcLength * percent;
        if(!this.state.reverse)
        {
            topArcLengthDis2 = 0;
            show1 = true;
            show2 = false;
        }

        if(this.state.input == 0) {
            show1 = false;
            show2 = false;
        }
        let dashArrayDis2 = `${topArcLengthDis2} ${circumference}`;

        let color1 = 48 + 189 * percent;
        let color2 = 48 + 32 * percent;
        let color3 = 48 + 1 * percent;

        let color = `rgb(${color1}, ${color2}, ${color3})`;

        if(this.state.input == 0) {
            color = "transparent";
        }

        return(

            <div style={{textAlign: "center"}}>
                <svg width="300" height="212">
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
                <div style={{textAlign: "center", width: "100%", position:"absolute", top: "18vh", right: "16.2vw"}}>
                    <h4 style={{textAlign:"center", position: "relative", fontSize: "2.5em", marginBottom: "10px"}}>{padLeadingZeros(parseInt(this.state.input), 3)}</h4>
                    <h4 style={{fontSize:"1.5em", fontWeight: "400"}}>dps</h4>
                </div>
            </div>

        );
    }

}