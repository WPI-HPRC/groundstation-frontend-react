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

/**
 *  general layout of the screen
 *  all top-level components are organized here, then they can have their own sub-components
 *  mostly panels etc 
 * 
 *  VehicleStatus
 *    - top right corner
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
 *    - contains connection, latency info + conncect, units buttons
 *  Visualization
 *    - below MissionStatus
 *    - map viewer
 *  MissionTimeline
 *    - bottom row
 *    - timestamps for mission objectives + current local time
 */

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { }
    }
    render() {
        return (
            <>
                <div className="Layout">
                    <Grid style={{width:"100%", backgroundColor: "inherit"}}>
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
            </>
        )
    }
}
