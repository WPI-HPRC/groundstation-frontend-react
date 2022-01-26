import { render } from '@testing-library/react';
import React from 'react';
import RTChart from 'react-rt-chart';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class VelBox extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { drawGraph: true };
        this.i = 0;
        this.chart = {
            axis: {
                y: {min: 0}
            },
            point: {
                show: false
            }
        };
        this.flow = {
            duration: 2
        };
    }

    componentDidMount() {
        setInterval(() => this.forceUpdate(), 500);
    }

    render() {
        this.i = this.i+2;

        var data = {
            date: new Date(),
            Car: this.i,
        };

        return (
            <>
                <div id='VelBox' style={{width:"33%", height:"100%"}}>
                    <div style={{width: "100%"}}>
                        <div style={{float: "left"}}>
                            <h3>Velocity</h3>
                        </div>
                        <div style={{float: "right", margin: "15px"}}>
                            <ButtonGroup aria-label="mode select">
                                <Button variant="info">Gauge</Button>
                                <Button variant="info">Graph</Button>
                            </ButtonGroup>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} id='VelMeter'>
                        Hello there
                    </div>


                    <div className={!this.state.drawGraph ? "hidden" : undefined} id='VelGraph'>
                        <RTChart chart={this.chart}
                                flow={this.flow}
                                fields={['Car']} 
                                data={data}
                                reset={!this.state.drawGraph} />
                    </div>
                </div>
            </>
        )
    }
}


/**
 * Acceleration display
 * @param {*} props 
 */
function AccelBox (props) {

}


/**
 * Altitude display
 * @param {*} props 
 */
function AltBox (props) {

}

function GaugeCluster (props) {

    return (
        <div className={props.className}>
            <VelBox />
            
        </div>
    );
}

export default GaugeCluster;