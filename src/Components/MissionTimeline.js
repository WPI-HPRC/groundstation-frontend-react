import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";

class MissionPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: props.name,
                       percentStart: props.percentStart,
                       percentEnd: props.percentEnd,
                       time: props.time };
    }

    render() {
        var timeStr = this.state.time.toISOString().substr(11, 8);

        return (
            <div style={{display: "inline-block", width: (this.state.percentEnd - this.state.percentStart) + "%", textAlign: "left", top: "0px", left:"0px"}}>
                <h4 style={{padding: "10px 0px 0px 0px", margin: "0px"}}>{this.state.name}</h4>
                <h6 style={{padding: "0px", margin: "0px"}}>|</h6>
                <br/>
                <h6 style={{padding: "0px", margin: "0px"}}>|</h6>
                <h6 style={{padding: "0px", margin: "0px"}}>{timeStr}</h6>

            </div>
        )
    }
}

export default class MissionTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stateStr: props.stateStr,
                       time: props.vehicleClock,
                       missionPoints: [ [0, 5, "Stby", new Date(0)],
                                        [5, 10, "Boot", new Date(0)],
                                        [10, 15, "DGN", new Date(0)],
                                        [15, 20, "Armed", new Date(0)],
                                        [20, 25, "Launch", new Date(0)],
                                        [25, 35, "Pwrd Asnt", new Date(0)],
                                        [35, 45, "Unpwrd Asnt", new Date(0)],
                                        [45, 50, "APO-G", new Date(0)],
                                        [50, 100, "Chute", new Date(0)],
                                        [100, 100, "GND", new Date(0)]]
                    };
    }
    
    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.stateStr !== props.stateStr ||
            current_state.time !== props.vehicleClock) {
            update = {
                stateStr: props.stateStr,
                time: props.vehicleClock,
            }
        }
        
        return update;
    }

    render() {                    
        var missionPercent = 0;
        var missionPoints = this.state.missionPoints;
        var currentState = this.state.stateStr;
        var currentClock = this.state.time;

        missionPoints.forEach(function(missionPoint) {
            
            if (missionPoint[2] === currentState) {
                missionPoint[3] = currentClock;
                missionPercent = missionPoint[0];
            }
        });

        return (
            <div className="panel">
                <div className="MissionTimeline" style={{position: "relative"}}>
                    <div style={{display: "inline-block", width: "15%", height: "100%", verticalAlign: "top"}}>
                        <h3>Mission Timeline</h3>
                    </div>
                    <div style={{display: "inline-block", position: "relative", width: "80%", height: "100%"}}>
                        <div style={{position: "absolute", top: "-10px", width: "100%"}}>
                            {missionPoints.map((elem) => (<MissionPoint key={elem[0]} name={elem[2]} percentStart={elem[0]} percentEnd={elem[1]} time={elem[3]}/>))}
                        </div>
                        <div style={{position: "absolute", top: "42px", width: "100%"}}>
                            <ProgressBar completed={missionPercent} isLabelVisible={false} bgColor="#ED5031" height="11px"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}