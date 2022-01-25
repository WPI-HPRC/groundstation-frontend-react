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
                <Row className="bordered">

                    <Col className="bordered" lg={9}>
                        <Row>
                            <Col className="bordered" lg={4}>
                                <VehicleStatus />
                            </Col>
                            
                            <Col lg={8}>
                                <ControlPanel />
                                <SystemPanel />
                            </Col>
                        </Row>
                        <GaugeCluster />
                    </Col>

                    <Col lg={3}>
                        <Row>
                            <TitlePlate className="TitlePlate"/>
                        </Row>
                        <Row>
                            <MissionStatus className="MissionStatus"/>
                        </Row>
                        <Row>
                            <Visualization />
                        </Row>
                    </Col>

                </Row>

                <Row className="bordered">
                    <MissionTimeline />
                </Row>
            </div>
            <main>{children}</main>
        </>
    )
}

export default Layout;