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
        this.state = {
            battery: props.battery,
            temperature: props.temperature,
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            vehicleClock: props.vehicleClock,
            vel: props.vel,
            accel: props.accel,
            altitude: props.altitude,
            receiver: props.receiver,
            rocket: props.rocket,
            missionClock: props.missionClock
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ 
            battery: props.battery,
            temperature: props.temperature,
            stateStr: props.stateStr,
            lat: props.lat,
            long: props.long,
            vehicleClock: props.vehicleClock,
            vel: props.vel,
            accel: props.accel,
            altitude: props.altitude,
            receiver: props.receiver,
            rocket: props.rocket,
            missionClock: props.missionClock
        });  
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
                                                {...this.state}/>
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
                                    {<GaugeCluster className="GaugeCluster"
                                        {...this.state} />
                                </Row>
                            </Col>

                            <Col lg={3}>
                                <Row style={{height:"13vh"}}>
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

                        <Row style={{height:"12vh"}}>
                            <MissionTimeline className="MissionTimeline" />
                        </Row>
                    </Grid>
                </div>
            </>
        )
    }
}
