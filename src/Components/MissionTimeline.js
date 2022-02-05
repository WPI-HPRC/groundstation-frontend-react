import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";

class MissionPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: props.name,
                       percentStart: props.percentStart,
                       percentEnd: props.percentEnd,
                       time: "00:00:00" };
    }

    render() {
        return (
            <div style={{display: "inline-block", width: (this.state.percentEnd - this.state.percentStart) + "%", textAlign: "left", top: "0px", left:"0px"}}>
                <h4 style={{padding: "10px 0px 0px 0px", margin: "0px"}}>{this.state.name}</h4>
                <h6 style={{padding: "0px", margin: "0px"}}>|</h6>
                <br/>
                <h6 style={{padding: "0px", margin: "0px"}}>|</h6>
                <h6 style={{padding: "0px", margin: "0px"}}>{this.state.time}</h6>

            </div>
        )
    }
}

export default class MissionTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = { missionPoints: [ [0, 10,"Power On"],
                                        [10, 40, "Lift Off"],
                                        [40, 50, "Apogee"],
                                        [50, 80, "Parachute Deploy"],
                                        [80, 100, "Recovery"],
                                        [100, 100, "Mission"]],
                       missionPercent: 50 };
    }

    render() {
        return (
            <div className="panel">
                <div className="MissioTimeline" style={{position: "relative"}}>
                    <div style={{display: "inline-block", width: "15%", height: "100%", verticalAlign: "top"}}>
                        <h3>Mission Timeline</h3>
                    </div>
                    <div style={{display: "inline-block", position: "relative", width: "80%", height: "100%"}}>
                        <div style={{position: "absolute", top: "-10px", width: "100%"}}>
                            {this.state.missionPoints.map((elem) => (<MissionPoint key={elem[0]} name={elem[2]} percentStart={elem[0]} percentEnd={elem[1]}/>))}
                        </div>
                        <div style={{position: "absolute", top: "42px", width: "100%"}}>
                            <ProgressBar completed={this.state.missionPercent} isLabelVisible={false} bgColor="#ED5031" height="11px"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}