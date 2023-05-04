import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";

/**
 *  bottom bar which contains the timestamps and current progress of the mission as well as 
 *  the time and date
 */

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class MissionPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: props.name,
            percentStart: props.percentStart,
            percentEnd: props.percentEnd,
            time: props.time,
        };
    }

    static getDerivedStateFromProps(current_state, props)
    {
        let update = null;
        if(current_state.time !== props.time)
        {
            update = {
                time: props.time,
            }
        }
        return update;
    }

    render() {
        var timeStr = this.props.time.toISOString().substr(14, 5);

        return (
            <div style={{height: "100%", display: "inline-block", width: this.state.percentStart === 100 ? "0%" : (this.state.percentEnd - this.state.percentStart) + "%", textAlign: this.state.percentStart === 100 ? "right" : "left", top: "0px", left:"0px"}}>
                <h4 style={{fontSize:"1.5vh", padding: "0.7vh 0px 0px 0px", margin: "0px"}}>{this.state.name}</h4>
                <h6 style={{fontSize:"1vh", padding: "0px", margin: "0px"}}>|</h6>
                <br/>
                <h6 style={{fontSize:"1vh", padding: "0px", margin: "0px"}}>|</h6>
                <h5 style={{fontSize:"2vh", padding: "0px", margin: "0px"}}>{timeStr}</h5>

            </div>
        )
    }
}

export default class MissionTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            dark: props.dark,
            stateStr: props.stateStr,
            vehicleTime: props.vehicleClock,
            clock: new Date(),
            missionPercent: 0,
            missionPoints: [ [0, 5, "Boot", new Date(0), 0],
                             [5, 15, "Pre-Launch", new Date(0), 1],
                             [15, 25, "Boost", new Date(0), 2],
                             [25, 50, "Coast", new Date(0), 3],
                             [50, 60, "Apogee", new Date(0), 4],
                             [60, 75, "Drogue", new Date(0), 5],
                             [75, 85, "Quad Deploy", new Date(0), 6],
                             [85, 100, "Main", new Date(0), 7],
                             [100, 100, "Landing", new Date(0), 8],],
        };

        this.clockId = 0;
    }
    
    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if (current_state.state !== props.state ||
            current_state.vehicleTime !== props.vehicleClock ||
            current_state.dark !== props.dark) {
            update = {
                state: props.state,
                vehicleTime: props.vehicleClock,
                dark: props.dark,
            }
        }
        if(props.vehicleClock.getTime() === 0) {
            update = {
                state: props.state,
                vehicleTime: props.vehicleClock,
                dark: props.dark,
                missionPercent: 0,
                missionPoints: [ [0, 5, "Boot", new Date(0), 0],
                         [5, 15, "Pre-Launch", new Date(0), 1],
                         [15, 25, "Boost", new Date(0), 2],
                         [25, 50, "Coast", new Date(0), 3],
                         [50, 60, "Apogee", new Date(0), 4],
                         [60, 75, "Drogue", new Date(0), 5],
                         [75, 85, "Quad Deploy", new Date(0), 6],
                         [85, 100, "Main", new Date(0), 7],
                         [100, 100, "Landing", new Date(0), 8],],
            } 
        }
        
        return update;
    }

    componentDidMount() {
        this.clockId = setInterval(() => this.updateClock(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clockId);
    }

    updateClock() {
        this.setState({
            clock: new Date()
        });
    }

    render() {                    
        var missionPoints = this.state.missionPoints;
        var currentState = this.state.state;
        var currentClock = this.state.vehicleTime;

        missionPoints.forEach(element => {

            if (element[4] === currentState && element[3].getTime() === 0 && this.state.vehicleTime.getTime() !== 0) {
                element[3] = currentClock;
                this.state.missionPercent = element[0];
            }
        });

        const time = this.state.clock;
        const tzStr = time.toLocaleString('en-us', {timeZoneName:'short'}).split(' ').pop();
        const month = time.toLocaleString('en-us', { month: 'long' });

        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{height: "100%"}}>
                <div className="MissionTimeline" style={{position: "relative", width: "100%", height: "100%"}}>
                    <div style={{display: "inline-block", width: "15%", height: "100%", verticalAlign: "top"}}>
                        <h3>Mission Timeline</h3>
                    </div>
                    <div style={{display: "inline-block", position: "relative", width: "60%", height: "100%"}}>
                        <div style={{position: "absolute", width: "100%", height: "100%"}}>
                            {missionPoints.map((elem) => (<MissionPoint key={elem[0]} name={elem[2]} percentStart={elem[0]} percentEnd={elem[1]} time={elem[3]}/>))}
                        </div>
                        <div  style={{position: "absolute", top: "3.75vh", left: "0.05vw", width: "100%", }}>
                            <ProgressBar completed={this.state.missionPercent} isLabelVisible={false} bgColor={"#ED5031"} barContainerClassName={this.state.dark ? "foregroundDark" : "foregroundLight"} height="1.5vh"/>
                        </div>
                    </div>
                    <div style={{display: "inline-block", position: "absolute", right: "0", height: "100%", width: "22%"}}>
                        <div className="subpanel" style={{position: "absolute", top: "10px", right: "10px", bottom: "10px", left: "10px"}}>
                            <div style={{display: "inline-block", position: "absolute", top: 0, left: 0, textAlign: "left", padding: 0, margin: 0, verticalAlign: "top"}}>
                                <h1 style={{fontFamily:"arial", fontSize: "2.5vh", margin: "0.2vh"}}>{month}</h1>
                            </div>
                            <div style={{display: "inline-block", position: "absolute", bottom: 0, left: 0, textAlign: "left", padding: 0, margin: 0, verticalAlign: "top"}}>
                                <h1 style={{fontFamily:"arial", fontSize: "4.5vh", margin: "0.2vh"}}>{time.getDate()}, {time.getFullYear()}</h1>
                            </div>
                            <div style={{display: "inline-block", position: "absolute", top: 0, right: 0, textAlign: "right", margin: "auto", verticalAlign: "top"}}>
                                <h1 style={{fontFamily:"arial", fontSize: "4.5vh", margin: "0.2vh"}}>{padLeadingZeros(time.getHours(), 2)}:{padLeadingZeros(time.getMinutes(),2)}:{padLeadingZeros(time.getSeconds(), 2)}</h1>
                            </div>
                            <div style={{display: "inline-block", position: "absolute", bottom: 0, right: 0, textAlign: "right", margin: "auto", verticalAlign: "top"}}>
                                <h1 style={{fontFamily:"arial", fontSize: "2.5vh", margin: "0.2vh"}}>{tzStr}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}