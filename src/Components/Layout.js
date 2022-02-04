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


const Layout = ({ children }) => {
    return (
        <>
            <div>
                <Grid style={{width:"100%"}}>
                    <Row style={{height:"90vh"}}>
                        <Col lg={9}>
                            <Row>
                                <Col lg={4}>
                                    <Row style={{height:"50vh"}}>
                                        <VehicleStatus className="VehicleStatus" />
                                    </Row>
                                </Col>
                                
                                <Col lg={8}>
                                    <Row style={{height:"10vh"}}>
                                        <ControlPanel className="ControlPanel" />
                                    </Row>
                                    <Row style={{height:"40vh"}}>
                                        <SystemPanel className="SystemPanel" />
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{height:"40vh"}}>
                                <GaugeCluster className="GaugeCluster" />
                            </Row>
                        </Col>

                        <Col lg={3}>
                            <Row style={{height:"15vh"}}>
                                <TitlePlate className="TitlePlate"/>
                            </Row>
                            <Row style={{height:"30vh"}}>
                                <MissionStatus/>
                            </Row>
                            <Row style={{height:"45vh"}}>
                                <Visualization className="Visualization"/>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{height:"10vh"}}>
                        <MissionTimeline className="MissionTimeline" />
                    </Row>
                </Grid>
            </div>
            <main>{children}</main>
        </>
    )
}

export default Layout;