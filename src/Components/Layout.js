import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';

import TitlePlate from './TitlePlate';
import MissionStatus from './MissionStatus';
import Visualization from './Visualization';
import VehicleStatus from './VehicleStatus';
import ControlPanel from './ControlPanel';
import SystemPanel from './SystemPanel';
import GaugeCluster from './GaugeCluster';
import MissionTimeline from './MissionTimeline';
import CubeDisplayPanel from './CubeDisplayPanel';
import CubeTopbar from './CubeTopbar';

/**
 *  general layout of the screen
 *  all top-level components are organized here, then they can have their own sub-components
 *  mostly panels etc 
 * 
 * ----------Main Window---------
 * 
 *  VehicleStatus
 *    - top left corner
 *    - contains info on temp, power, lat/long, mission time
 *  ControlPanel
 *    - top center
 *    - console + timesplice control
 *  SystemPanel
 *    - below ControlPanel
 *    - contains the 3 gyro gauges
 *  GaugeCluser
 *    - below SystemPanel
 *    - contains the pos/vel/accel gauges
 *  TitlePlate
 *    - top right
 *    - contains logo + name
 *  MissionStatus
 *    - below TitlePlate
 *    - contains connection, latency info + connect, units buttons
 *  Visualization
 *    - below MissionStatus
 *    - map viewer
 *  MissionTimeline
 *    - bottom row
 *    - timestamps for mission objectives + current local time
 * 
 *  ---------Cube Window---------
 * 
 *  CubeTopbar
 *    - top row
 *    - contains the SETTINGS button, signal strength, flight clock (TODO)
 * 
 *  CubeDisplayPanel
 *    - middle row
 *    - the three main panels showing the cubes' sensor readings
 *    - signal icon
 */

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            window: props.window,
            showPowerLossWarning: false,
            powerLossWarning: props.powerLossWarning,

        }
    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;

        if(current_state.window !== props.window)
        {
            update = {
                window: props.window,
            }
        }
        if(current_state.powerLossWarning !== props.powerLossWarning)
        {
            update = {
                window: props.window,
                showPowerLossWarning: props.powerLossWarning,
                powerLossWarning: props.powerLossWarning,
            }
        }
        return update;
    }

    dismissPLWarning(event) 
    {
        this.setState({
            showPowerLossWarning: false,
        });
    }

    render() {
        return (
            <>
                <div className={this.state.window === 0 ? "Layout" : "hidden"}>
                    <Grid style={{width:"100%"}}>
                        <Row style={{height:"88vh"}}>
                            <Col lg={9}>
                                <Row>
                                    <Col lg={4}>
                                        <Row style={{height:"58vh"}}>
                                            <VehicleStatus className="VehicleStatus" 
                                                {...this.props}/>
                                        </Row>
                                    </Col>
                                    
                                    

                                    <Col lg={8}>
                                        <Row style={{height:"18vh"}}>
                                            <ControlPanel className="ControlPanel" 
                                                {...this.props}/>
                                        </Row>
                                        <Row style={{height:"39vh"}}>
                                            <SystemPanel className="SystemPanel" 
                                                {...this.props} />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{height:"29vh"}}>
                                    <GaugeCluster className="GaugeCluster"
                                        {...this.props} />
                                </Row>
                            </Col>

                            <Col lg={3}>
                                <Row style={{height:"13vh"}}>
                                    <TitlePlate className="TitlePlate"
                                        {...this.props} />
                                </Row>
                                <Row style={{height:"30vh"}}>
                                    <MissionStatus
                                        unitFunc = {this.props.unitFunc}
                                        {...this.props} />
                                </Row>
                                <Row style={{height:"45vh"}}>
                                    <Visualization className="Visualization"
                                        {...this.props}/>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{height:"11vh"}}>
                            <MissionTimeline 
                                {...this.props}/>
                        </Row>
                    </Grid>
                </div>
                <div className={this.state.window === 1 ? "CubeWindow" : "hidden"} style={{height: "100%", width:"99.25vw"}}/* Cube Display Window */> 
                    <Row style={{height:"19.5vh"}}>
                        {/* <div style={{width:"0.75vw"}}/> */}
                        <div style={{width:"99.75%"}}>
                            <CubeTopbar className="CubeTopbar" 
                                unitFunc = {this.props.unitFunc}
                                modeFunc = {this.props.modeFunc}
                                windowFunc = {this.props.windowFunc}
                                {...this.props}/>
                        </div>
                    </Row>
                    <Row style={{height:"0.375vh"}}/>
                    <Row style={{height:"67vh"}}>
                        <div style={{width:"0.375vw"}}/>
                        <div style={{width:"32.83vw"}}> 
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Curly"} signalStrength={this.props.cubeStrength1} batteryPercent={this.props.cubeBattery1} /* Cube 1 */
                                {...this.props}/> 
                        </div>
                        <div style={{width:"0.5vw"}}/>
                        <div style={{width:"32.83vw"}}>
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Larry"} signalStrength={this.props.cubeStrength2} batteryPercent={this.props.cubeBattery2} /* Cube 2 */
                                {...this.props}/> 
                        </div>
                        <div style={{width:"0.5vw"}}/>
                        <div style={{width:"32.83vw"}}>
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Moe"} signalStrength={this.props.cubeStrength3} batteryPercent={this.props.cubeBattery3} /* Cube 3 */ 
                                {...this.props}/> 
                        </div>
                    </Row>
                    <Row style={{height:"0.5vh"}}/>
                    <Row style={{height:"12vh"}}>
                        <Col style={{width:"1vw"}}/>
                        <Row style={{width:"99.625vw"}}>
                            <MissionTimeline 
                                {...this.props}/>
                        </Row>
                    </Row>
                </div>
                <div className={!this.state.showPowerLossWarning ? "hidden" : undefined} style={{zIndex:"100000", backgroundColor: "red", position: "absolute", left: "25vw", height: "50vh", width: "50vw", top: "25vh"}}>
                    <div style={{width: "100%", height: "100%"}}>
                        <div className={"row"} style={{width: "100%"}}> 
                            <h4 style={{left: "8vw", top: "20vh", position: "relative", fontSize: "10vh"}}>POWER LOSS</h4>
                        </div>
                        <div className={"row"} >
                            <button style={{postion: "relative", top: "25vh"}} onClick={() => this.dismissPLWarning()} className={"customButtonLg"}>Dismiss</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
