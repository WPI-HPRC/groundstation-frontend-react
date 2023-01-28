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

        let angle0 = 0 + 45 * (this.state.airbrakesDeploy / 100);
        let angle1 = 90 + 45 * (this.state.airbrakesDeploy / 100);
        let angle2 = 180 + 45 * (this.state.airbrakesDeploy / 100);
        let angle3 = 270 + 45 * (this.state.airbrakesDeploy / 100);


        let transform0 = `rotate(${angle0}, 80, 80)`;
        let transform1 = `rotate(${angle1}, 80, 80)`;
        let transform2 = `rotate(${angle2}, 80, 80)`;
        let transform3 = `rotate(${angle3}, 80, 80)`;



        return(
            <svg width="160" height="160">
                <circle cx="80" cy="80" r="75" fill="transparent" stroke="white" strokeWidth={5}>
                    
                </circle>
                <circle cx="20" cy="80" r="60" transform={transform0} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"}/>
                <circle cx="20" cy="80" r="60" transform={transform0} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"}/>

                <circle cx="20" cy="80" r="60" transform={transform1} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"}/>
                <circle cx="20" cy="80" r="60" transform={transform1} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"}/>

                <circle cx="20" cy="80" r="60" transform={transform2} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"}/>
                <circle cx="20" cy="80" r="60" transform={transform2} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"}/>

                <circle cx="20" cy="80" r="60" transform={transform3} fill="transparent" stroke="white" strokeWidth={20} strokeDasharray={dA} strokeLinecap={"round"}/>
                <circle cx="20" cy="80" r="60" transform={transform3} fill="transparent" stroke="#212121" strokeWidth={10} strokeDasharray={dA} strokeLinecap={"round"}/>


                <circle cx="80" cy="80" r="20" fill="white"/>

            </svg>
        )
    }
}