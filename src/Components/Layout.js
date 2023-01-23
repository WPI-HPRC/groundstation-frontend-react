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
// import ScatterPlot from './Chart';


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
 *  CubeDisplayPanel
 *    - middle row
 *    - the three main panels showing the cubes' sensor readings
 * 
 */

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            window: props.window,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if(current_state.window !== props.window)
        {
            return {
                window: props.window,
            }
        }
    }

    render() {
        return (
            <>
                <div className={this.state.window == 0 ? "Layout" : "hidden"}>
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
                                        <Row style={{height:"40vh"}}>
                                            <SystemPanel className="SystemPanel" 
                                                {...this.props} />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{height:"30vh"}}>
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

                        <Row style={{height:"12vh"}}>
                            <MissionTimeline 
                                {...this.props}/>
                        </Row>
                    </Grid>
                </div>
                <div className={this.state.window == 1 ? "CubeWindow" : "hidden"} /* Cube Display Window */> 
                    <Row style={{height:"19.5vh"}}>
                        <div style={{width:"0.375vw"}}/>
                        <div style={{width:"99.5vw"}}>
                            <CubeTopbar className="CubeTopbar" 
                                unitFunc = {this.props.unitFunc}
                                modeFunc = {this.props.modeFunc}
                                windowFunc = {this.props.windowFunc}
                                {...this.props}/>
                        </div>
                    </Row>
                    <Row style={{height:"68vh"}}>
                        <div style={{width:"0.375vw"}}/>
                        <div style={{width:"33vw"}}> 
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Curly"} /* Cube 1 */
                                {...this.props}/> 
                        </div>
                        <div style={{width:"0.25vw"}}/>
                        <div style={{width:"33vw"}}>
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Larry"} /* Cube 2 */
                                {...this.props}/> 
                        </div>
                        <div style={{width:"0.25vw"}}/>
                        <div style={{width:"33vw"}}>
                            <CubeDisplayPanel className={"CubeDisplayPanel"} cubeName={"Moe"} /* Cube 3 */ 
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
            </>
        )
    }
}
