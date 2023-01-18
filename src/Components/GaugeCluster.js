import React from 'react';
import { ArcGauge } from "@progress/kendo-react-gauges";

// import { dataOut as data } from './data';
// import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { ResponsiveLine } from '@nivo/line';
import { quantizeColorScalePropType } from 'nivo/lib/props/colors';
const config = require('../mission.cfg');
const dataScalar = -1;

/**
 *  The group of gauges that handles the altitude, velocity, and acceleration
 *  not to be confused with SystemPanel which handles gyroscopes
 */

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class Box extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            drawGraph: false, // show graph vs gauge display
            val0: props.val0,
            val1: props.val1,
            val2: props.val2,
            time: props.time,
            graphTime: props.time,
            data0: [],
            data1: [],
            data2: [],
            data: [
                {
                    id: "Acceleration",
                    data: []
                },
            ],
            enable: false,
            gaugeLevel: 0,
            max: 0,
            timeScale: props.datanum,
            rollingAvg: 0,
            finalData: [ // the data for each graph; 1: accel 2: vel 3: pos
                {
                    id: "dataInput",
                    data: []
                },
            ],

            graphType: props.graphType,
            timeToRefresh: true
        };

    }

    // Data update performed here
    static getDerivedStateFromProps(props, current_state) {

        // Update on new time
        // check if time has changed
        if (current_state.time !== props.time) {

            // Reset if rocket time returns to 0
            if (props.time.getTime() === 0) {
                return {
                    val0: 0,
                    val1: 0,
                    val2: 0,
                    data0: [],
                    data1: [],
                    data2: [],
                    max: 0,
                    time: props.time,
                    graphTime: props.time
                }
            }

            // Update data sets with new values
            else {
                // check if it is time to update
                if ((props.time.getTime() - current_state.graphTime.getTime()) >= props.graphRefreshRate) {
                    return {
                        val0: props.val0,
                        val1: props.val1,
                        val2: props.val2,
                        data0: [...current_state.data0.slice(props.datanum * dataScalar), [props.time.getTime(), props.val0]],
                        data1: [...current_state.data1.slice(props.datanum * dataScalar), [props.time.getTime(), props.val1]],
                        data2: [...current_state.data2.slice(props.datanum * dataScalar), [props.time.getTime(), props.val2]],
                        max: current_state.max > props.val0 ? current_state.max : props.val0,
                        time: props.time,
                        graphTime: props.time,
                        
                    }
                }
                // do nothing if it is not time to refresh yet
                else {
                    return {
                        val0: props.val0,
                        val1: props.val1,
                        val2: props.val2,
                        max: current_state.max > props.val0 ? current_state.max : props.val0,
                        time: props.time,
                        
                    }
                }
            }
        }
        return null
    }
    // perform initialization animation 8 seconds after system loads to give time for loading screen
    componentDidMount() {

        setTimeout(() => {this.initAnimation()}, 8000);
    }
    
    // switch from gauge to graph and back again
    handleClick() {
        this.setState((state, props) => ({
            drawGraph: !state.drawGraph
        }));
    }
    
    /*
    * Gauge start animation: 
    *  - go from zero to max
    *  - set value to zero
    *  - go from max to zero
    */

    initAnimation() {
        // setting gauge to max value
        this.setState({
            gaugeLevel: this.props.max
        });
        // set gauge back to zero 1 second after, giving time for animation to complete
        setTimeout(() => {
            this.setState({
                enable: true,
                drawGraph: this.props.defaultToGraph
            });
        }, 1000);
    }

    render() {

        let timeOffset = this.props.datanum / 10 ?? 10; // use the timesplice to determine how many seconds of data to show

        // if the time is less than TS seconds, show graph from 0 to TS anyway
        // once time gets past TS seconds, graph will show previous TS seconds of data
        let graphMax = this.props.time.getTime() ?? 10; // make sure that the Date prop (time) isn't undefined
        let graphMin = this.props.time.getTime() - timeOffset * 1000;
        if(graphMax < timeOffset * 1000) // if time less than offset
        {
            graphMax = timeOffset * 1000; // max value of graph = offset
            graphMin = 0;
        }

        let testTimeFactor = 1000; // for testing purposes, treating 1ms as 100ms aka time / 10 rather than time / 1000

        if((this.state.data[0].data[0] == undefined) || (this.state.data[0].data[this.state.data[0].data.length - 1].x !== this.props.time.getTime() / testTimeFactor)) 
        {

            // make some new data points for the current values
            let element = {
                x: this.props.time.getTime() / testTimeFactor,
                y: this.state.val0 // MAKE SURE TO UPDATE THIS FOR TESTING
                // what are the odds i forget?  probably high
            }

            // add them to the base array
            this.state.data[0].data.push(element);
        }

        

        // search through data array (data) and find anything between min and max
        // data[0] --> acceleration data[1] --> velocity data[2] --> position

        // let tempData = [];

        // this.state.data[0].data.forEach(element => {
        //     if(element.x >= graphMin/1000 && element.x <= (this.props.time.getTime()/1000))
        //     {
        //         tempData.push(element);
        //     } 
        // });

        // this.state.data[0].data = [];

        // tempData.forEach(element => {
        //     if(element.x >= graphMin/1000 && element.x <= (this.props.time.getTime()/1000))
        //     {
        //         this.state.data[0].data.push(element);
        //     } 
        // });
        
        if(this.state.data[0].data[0].x < graphMin/1000)
        {
            this.state.data[0].data.shift();
        }


        

        


        // index of each data point.  allows to use resolution variable to change what fraction of the points are displayed
        // for example, resolution of 2 would be 50%, 100 would be 1%, etc.
        let ind = 0;

        let resolution = 10;

        this.state.finalData[0].data = [];

        this.state.data[0].data.forEach(element => {
            if(ind % resolution == 0 && element.x >= graphMin/1000 && element.x <= this.state.time.getTime()/1000)
            {
                this.state.finalData[0].data.push(element);
            } 
            ind += 1;
        });
       


        const colors = [
            {
              to: this.props.threshold,
              color: "#6D6D6D",
            },
            {
              from: this.props.threshold,
              to: this.props.max,
              color: "#ED5031",
            }
        ];

        const arcOptions = {
            value: this.state.enable ? this.state.val0 : this.state.gaugeLevel,
            colors
        }

        const centerRenderer = (value, color) => {

            return (
                <>
                    <div>
                        <h4>{this.props.unit}</h4>
                        <h3
                            className="subpanel"
                            style={{
                                color: "#F7F7F7",
                                fontSize: "3.5em",
                                margin: "0px 20px 20px 20px",
                                textAlign: "center",
                                position: 'relative',
                            }}
                        >
                            {padLeadingZeros(parseInt(value), this.props.digits)}
                        </h3>
                    </div>
                </>
            );
        };

        return (
            <>
                <div style={{display:"inline-block", position: "relative", width:"33%", height:"100%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", height: "20%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>{this.props.title}</h3>
                        </div>
                        <div style={{position: "absolute", top:0, right: 0, bottom: 0, left: 0, textAlign:"right", margin: "10px 0px 0px 0px"}}>
                            <button className={"customButtonLg"} onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{height: "80%"}}>
                        <ArcGauge {...arcOptions} centerRender={centerRenderer} style={{width: "100%", height: "100%"}} scale={{startAngle: -40, endAngle: 220, rangeSize: 10, min: this.props.min, max: this.props.max}}/>
                    </div>
                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", bottom: 0, right: 0, height: "15%", textAlign: "right"}}>
                            <h3 style={{margin: 0, padding: 5}}>Max: {this.state.max}</h3>
                    </div>

                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{height: "100%", width: "80%", position:"absolute", top: "50px"}}>
                        <ResponsiveLine
                            data={ this.state.finalData }
                            margin={{ top: 10, right: 10, bottom: 80, left: 90 }}
                            xScale={{ type: 'linear', min: graphMin/1000 ?? 10, max: graphMax/1000 ?? 10 }}
                            xFormat=">-.2f"
                            yScale={{ type: 'linear', min: 0, max: 'auto' }}
                            // yScale={{ type: 'auto' }}
                            yFormat=">-.2f"
                            blendMode="normal"
                            animate={false}
                            nodeSize={10}
                            theme={{
                                textColor: '#ffffff',
                                fontSize: '14px',
                                axis: {
                                    legend: {
                                        text: {
                                            fontSize: '14px'
                                        }   
                                    }
                                },
                                tooltip: {
                                    container: {
                                        background: "#000000",
                                        textColor: "#333333",
                                        fontSize: "14px"
                                    }
                                },
                            }}
                            colors={{ scheme: 'red_yellow_blue'}}
                            axisTop={null}
                            axisRight={null}
                            enableGridX={false}
                            useMesh={true}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Time (seconds)',
                                legendPosition: 'middle',
                                legendOffset: 46,
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                fontSize: '14px',
                                legend: this.props.unit,
                                legendPosition: 'middle',
                                legendOffset: -60
                            }}
                            legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                                ]
                            }
                            ]}
                        />
                    </div>
                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", top: "25%", right: 0, height: "0%", textAlign: "right"}}>
                        <h3 style={{fontSize: "2.5em", margin: 0, padding: 0}}>
                            {this.state.val0}
                        </h3>
                        <h4 style={{ margin: 0, padding: 0}}>
                            {this.props.unit}
                        </h4>
                    </div>  
                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", bottom: 0, right: 0, height: "5%", textAlign: "right"}}>
                        <h4 style={{ margin: 0, padding: 0}}>
                            {this.props.datanum / 10}s
                        </h4>
                    </div>
                </div>
            </>
        )
    }
}


export default class GaugeCluster extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            vel: props.vel,
            accelX: props.accelX,
            accelY: props.accelY,
            accelZ: props.accelZ,
            altitude: props.altitude,
            vehicleClock: props.vehicleClock,
            timeScale: props.timeScale,
            showMetric: false,
            altUnit: "m",
            accelUnit: "m/s/s",
            velUnit: "m/s"
        }

    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;
        if (current_state.vehicleClock !== props.vehicleClock ||
            current_state.timeScale !== props.timeScale || 
            current_state.showMetric !== props.showMetric) {
            

            if(props.showMetric) {
                update = {
                    vel: props.vel,
                    accelX: props.accelX,
                    accelY: props.accelY,
                    accelZ: props.accelZ,
                    altitude: parseFloat(props.altitude).toFixed(2),
                    vehicleClock: props.vehicleClock,
                    timeScale: props.timeScale,
                    altUnit: "m",
                    accelUnit: "m/s/s",
                    velUnit: "m/s",
                    showMetric: props.showMetric

                }
            } else {
                update = {
                    vel: (props.vel * 3.281).toFixed(2),
                    accelX: (props.accelX / 9.80665).toFixed(2),
                    accelY: (props.accelY / 9.80665).toFixed(2),
                    accelZ: (props.accelZ / 9.80665).toFixed(2),
                    altitude: (props.altitude * 3.281).toFixed(2),
                    vehicleClock: props.vehicleClock,
                    timeScale: props.timeScale,
                    altUnit: "ft",
                    accelUnit: "G",
                    velUnit: "ft/s",
                    showMetric: props.showMetric
                }
            }

        }
        
        return update;
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="GaugeCluster" style={{height: "90%"}}>
                    <Box title="Altitude" unit={this.state.altUnit} min={0} max={9999} defaultToGraph={false}
                        threshold={900} digits={4} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.altitude} name0={"Altitude"}
                        />
                    <Box title="Velocity" unit={this.state.velUnit} min={0} max={300} defaultToGraph={false}
                        threshold={200} digits={3} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.vel} name0={"Velocity ΔA"}
                        />
                    <Box title="Acceleration" unit={this.state.accelUnit} min={0} max={3000} 
                        threshold={2000} digits={4} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} 
                        val0={this.state.accelY} name0="Y"
                        val1={this.state.accelX} name1="X"
                        val2={this.state.accelZ} name2="Z"
                        />
                </div>
            </div>
        );
        }
}