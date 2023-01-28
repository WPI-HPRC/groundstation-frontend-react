import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import React from 'react';

export default class AirbrakesIndicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            airbrakesDeploy: props.airbrakesDeploy
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if(current_state.airbrakesDeploy !== props.airbrakesDeploy) {
            update = {
                airbrakesDeploy: props.airbrakesDeploy,
            }
        }

        return update;
    }

    render() {

        let circumference = 60 * 2 * Math.PI;
        let dA = `85 ${circumference}`;

        let angle0 = 70 - 20 * (this.state.airbrakesDeploy / 100);
        let angle1 = 160 - 20 * (this.state.airbrakesDeploy / 100);
        let angle2 = 250 - 20 * (this.state.airbrakesDeploy / 100);
        let angle3 = 340 - 20 * (this.state.airbrakesDeploy / 100);

        let scale = 0.55

        let height = 180 * scale;
        let width = 250 * scale;

        let transform0 = `rotate(${angle0}, 125, 90)`;
        let transform1 = `rotate(${angle1}, 125, 90)`;
        let transform2 = `rotate(${angle2}, 125, 90)`;
        let transform3 = `rotate(${angle3}, 125, 90)`;

        let x1 = 150 + (50 * scale) * (this.state.airbrakesDeploy / 100);



        return(
            <svg width="250" height="180">
                <g transform={`rotate(45, 125, 90)`}>
                    <circle cx="125" cy="90" r="70" fill="transparent" stroke="white" strokeWidth={5}></circle>
                    
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 0.3s"}}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 0.3s"}} transform={`rotate(90, 125, 90)`}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 0.3s"}} transform={`rotate(180, 125, 90)`}/>
                    <rect x={x1} y={90 - 25} width="50" height="50" rx="5" fill="grey" style={{transition: "x 0.3s"}} transform={`rotate(270, 125, 90)`}/>

                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform0} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>
                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform0} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>

                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform1} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>
                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform1} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>

                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform2} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>
                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform2} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>

                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform3} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>
                    <circle cx={125 - width/2.5} cy={90} r={width/2.5} transform={transform3} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"} style={{transition: "transform 0.3s"}}/>

                    <circle cx={125} cy={90} r="20" fill="white"/>
                </g>
            </svg>
        )
    }
}