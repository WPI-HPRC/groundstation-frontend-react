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


export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { }
    }

    render() {
        return (
            <>
                <div>
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
                                            <ControlPanel className="ControlPanel" />
                                        </Row>
                                        <Row style={{height:"40vh"}}>
                                            <SystemPanel className="SystemPanel" />
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
                                    <TitlePlate className="TitlePlate"/>
                                </Row>
                                <Row style={{height:"30vh"}}>
                                    <MissionStatus
                                        {...this.props}/>
                                </Row>
                                <Row style={{height:"45vh"}}>
                                    <Visualization className="Visualization"/>
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