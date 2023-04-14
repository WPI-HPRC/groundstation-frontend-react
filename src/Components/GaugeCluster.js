import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Gauge } from './CustomSVG';


/**
 *  The group of gauges that handles the altitude, velocity, and acceleration
 *  not to be confused with SystemPanel which handles gyroscopes
 */


class Box extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { 
            drawGraph: false, // show graph vs gauge display
            val0: props.val0,
            val1: props.val1,
            val2: props.val2,
            time: props.time,
            dark: props.dark,
            graphTime: props.time,
            data: [ // the stored data for the last 10 seconds
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
            finalData: [ // the data to be displayed
                {
                    id: "dataInput",
                    data: []
                },
            ],

            graphType: props.graphType,
            timeToRefresh: true,
            animationID: null,
            window: props.window,
            units: props.showMetric,
        };

    }

    // Data update performed here
    static getDerivedStateFromProps(props, current_state) { // FLAG

        // Update on new time
        // check if anything has changed
        if (current_state.time !== props.time ||
            current_state.dark !== props.dark ||
            current_state.window !== props.window ||
            current_state.val0 !== props.val0 ||
            current_state.units !== props.showMetric ||
            current_state.altMSL !== props.altMSL) {


            // Reset if rocket time returns to 0
            if (props.time.getTime() === 0) {
                return {
                    val0: 0,
                    val1: 0,
                    val2: 0,
                    max: 0,
                    time: props.time,
                    graphTime: props.time,
                    dark: props.dark,
                    finalData: [ // the data to be displayed
                        {
                            id: "dataInput",
                            data: []
                        },
                    ],
                    data: [
                        {
                            id: "Acceleration",
                            data: []
                        },
                    ],
                }
            }

            // Update data sets with new values
            else {
                if (current_state.units !== props.showMetric ||
                    current_state.altMSL !== props.altMSL) {
                    return {
                        val0: props.val0,
                        val1: props.val1,
                        val2: props.val2,
                        dark: props.dark,
                        altMSL: props.altMSL,
                        max: current_state.max > props.val0 ? current_state.max : props.val0,
                        time: props.time,
                        data: [
                            {
                                id: "Acceleration",
                                data: []
                            },
                        ],
                        finalData: [ // the data for each graph; 1: accel 2: vel 3: pos
                            {
                                id: "dataInput",
                                data: []
                            },
                        ],
                        units: props.showMetric,
                        
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
                        dark: props.dark,
                        altMSL: props.altMSL,
                    }
                }
            }
        }
        return null
    }
    // perform initialization animation 8 seconds after system loads to give time for loading screen
    componentDidMount() {

        this.setState({
            animationID: setTimeout(() => {this.initAnimation()}, 8000),
        });
    }
    
    componentWillUnmount() {
        clearTimeout(this.state.animationID);
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
            val0: 9999
        });
        // set gauge back to zero 1 second after, giving time for animation to complete
        setTimeout(() => {
            this.setState({
                val0: 0
            });
        }, 1000);
    }

    render() {

        // let timeOffset = this.props.datanum / 10 ?? 10; // use the timesplice to determine how many seconds of data to show

        let timeOffset = 5;

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

        if((this.state.data[0].data[0] === undefined) || (this.state.data[0].data[this.state.data[0].data.length - 1].x !== this.props.time.getTime() / testTimeFactor)) 
        {

            // make some new data points for the current values
            let element = {
                x: this.props.time.getTime() / testTimeFactor,
                y: this.state.val0, // MAKE SURE TO UPDATE THIS FOR TESTING
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


        let resolution = this.props.datanum / 10;

        this.state.finalData[0].data = [];
        this.state.data[0].data.forEach((element, index) => {
            // element.x >= graphMin/1000 &&
            if(index % resolution === 0 && element.x >= graphMin/1000 && element.x <= this.state.time.getTime()/1000)
            {
                this.state.finalData[0].data.push(element);
            } 
        
        });

        

        return (
            <>
                <div style={{display:"inline-block", position: "relative", width:"33%", height:"85%", textAlign: "center", verticalAlign: "top"}}>
                    <div style={{width: "100%", height: "20%", textAlign: "left"}}>
                        <div style={{display:"inline-block", width: "50%"}}>
                            <h3>{this.props.title}</h3>
                        </div>
                        <div style={{position: "absolute", top:0, right: 0, bottom: 0, left: 0, textAlign:"right", margin: "10px 0px 0px 0px"}}>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.handleClick()}>
                                {this.state.drawGraph ? "View Gauge" : "View Graph"}
                            </button>
                        </div>
                    </div>

                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{height: "100%"}}>
                        <Gauge style={{height: "100%"}} input={this.state.val0} dark={this.state.dark} unit={this.props.unit} digits={this.props.digits}/>
                    </div>
                    <div className={this.state.drawGraph ? "hidden" : undefined} style={{position: "absolute", bottom: 0, right: 0, height: "15%", textAlign: "right"}}>
                            <h3 style={{margin: 0, padding: 5}}>Max: {this.state.max}</h3>
                    </div>

                    <div className={!this.state.drawGraph ? "hidden" : undefined} style={{height: "100%", width: "80%", position:"absolute", top: "50px"}}>
                        <ResponsiveLine
                            data={ this.state.finalData }
                            margin={{ top: 10, right: 10, bottom: 80, left: 90 }}
                            xScale={{ 
                                type: 'linear',
                                // format: '%H:%M:%S',
                                min: graphMin/1000 ?? 10, 
                                max: graphMax/1000 ?? 10,
                                precision: 1, 
                            }}
                            xFormat=">-.2f"
                            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                            // yScale={{ type: 'auto' }}
                            yFormat=">-.2f"
                            blendMode="normal"
                            animate={false}
                            nodeSize={10}
                            theme={{
                                textColor: this.state.dark ? "#ffffff" : "#000000",
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
                                        background: this.state.dark ? "#141414" : "#607d8b",
                                        textColor: "#ffffff",
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
                                tickValues: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                // format: '%H:%M:%S',
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
                            {Math.round(100 / (this.props.datanum / 10))}% 
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
            altMSL: props.altMSL,
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
            velUnit: "m/s",
            window: props.window,
        }

    }

    static getDerivedStateFromProps(props, current_state) {
        let update = null;
        if (current_state.vehicleClock !== props.vehicleClock ||
            current_state.timeScale !== props.timeScale || 
            current_state.showMetric !== props.showMetric ||
            current_state.dark !== props.dark ||
            current_state.window !== props.window ||
            current_state.accelY !== props.accelY ||
            current_state.altitude !== props.altitude ||
            current_state.vel !== props.vel ||
            current_state.altMSL !== props.altMSL) {
            

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
                    altMSL: props.altMSL,
                    velUnit: "m/s",
                    showMetric: props.showMetric,
                    dark: props.dark,
                    window: props.window,
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
                    altMSL: props.altMSL,
                    showMetric: props.showMetric,
                    dark: props.dark,
                    window: props.window,
                }
            }

        }
        
        return update;
    }

    render() {

        let altString = `Altitude ${this.props.altMSL ? "(MSL)" : "(AGL)"}`;

        return (
            <div className={`panel ${this.props.dark ? "darkPanel" : "lightPanel"}`} style={{height:"100%"}}>
                <div className="GaugeCluster" style={{height: "100%"}}>
                    <Box title={altString}  unit={this.state.altUnit} min={0} max={9999} defaultToGraph={false}
                        threshold={900} digits={4} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.altMSL ? this.state.altitude : this.state.showMetric ? this.state.altitude - this.props.currentAlt : this.state.altitude - (this.props.currentAlt/0.3048)} name0={"Altitude"}
                        dark={this.state.dark} showMetric={this.props.showMetric} altMSL={this.props.altMSL}
                        />
                    <Box title="Velocity" unit={this.state.velUnit} min={0} max={300} defaultToGraph={false}
                        threshold={200} digits={3} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} val0={this.state.vel} name0={"Velocity ΔA"}
                        dark={this.state.dark} showMetric={this.props.showMetric} altMSL={this.props.altMSL}

                        />
                    <Box title="Acceleration" unit={this.state.accelUnit} min={0} max={3000} 
                        threshold={2000} digits={4} graphRefreshRate={this.props.graphRefreshRate}
                        datanum={this.state.timeScale} time={this.state.vehicleClock} 
                        val0={this.state.accelY} name0="Y"
                        val1={this.state.accelX} name1="X"
                        val2={this.state.accelZ} name2="Z"
                        dark={this.state.dark} 
                        showMetric={this.props.showMetric}
                        altMSL={this.props.altMSL}
                        />
                </div>
            </div>
        );
        }
}