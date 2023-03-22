import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { BarSignalIcon } from './CustomSVG';

/* 
* The three panels which each handle one of the cubes on the cube window
*/ 

export default class CubeDisplayPanel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark, // UI state
            cubeName: props.cubeName, // the name of the cube, Curly, Larry, or Moe
            lastTemp: props.lastTemp, // previously logged temperature
            lastHmid: props.lastHmid, // previously logged humidity
            lastPres: props.lastPres, // previously logged pressure
            showTemp: true, // show the temperature graph
            showHmid: false, // show the humidity graph
            showPres: false, // show the pressure graph
            cubeDataT: // data series for the temperature
                {
                    id: "Temperature",
                    color: 'yellow', // this does not actually matter right now, it gets set later depending on the UI state
                    data: [
                    ]
                },
            
            cubeDataH: // data series for the humidity
                {
                    id: "Humidity",
                    color: 'orange',
                    data: [
                    ]
                },
            
            cubeDataP: // data series for the pressure
                {
                    id: "Pressure",
                    color: 'red',
                    data: [
                        
                    ]
                },
            
            cubeData: [], // the empty data, which the series wanted will be added
            legendString: "", // the legend displayed on the graphs
            showMetric: props.showMetric, // units
            time: props.vehicleClock, // time
            RSSI: 0, // RSSI which may or may not be implemented at some point
        }
    }

    static getDerivedStateFromProps(props, current_state) { // update to new values if anything important has changed
        let update = null;
        if(current_state.showMetric !== props.showMetric ||
            current_state.time !== props.vehicleClock ||
            current_state.lastHmid !== props.lastHmid ||
            current_state.lastPres !== props.lastPres ||
            current_state.lastTemp !== props.lastTemp ||
            current_state.dark !== props.dark) {
            
            if(props.vehicleClock.getTime() === 0){ // reseting the system if the time returns to zero (which wil only happen at start or when clear is pressed)
                update = {
                    dark: props.dark,
                    cubeName: props.cubeName,
                    lastTemp: 0,
                    lastHmid: 0,
                    lastPres: 0,

                    cubeDataT: 
                        {
                            id: "Temperature",
                            color: 'yellow',
                            data: [
                                {
                               
                                }
                            ]
                        },
                    
                    cubeDataH: 
                        {
                            id: "Humidity",
                            color: 'orange',
                            data: [
                                {
                               
                                }
                            ]
                        },
                    
                    cubeDataP: 
                        {
                            id: "Pressure",
                            color: 'red',
                            data: [
                                {
                               
                                }
                            ]
                        },
                    
                    cubeData: [],
                    legendString: "",
                    showMetric: props.showMetric,
                    time: props.vehicleClock,
                }
            } else {
                return {
                    showMetric: props.showMetric,
                    time: props.vehicleClock,
                    lastHmid: props.lastHmid,
                    lastPres: props.lastPres,
                    lastTemp: props.lastTemp,
                    dark: props.dark,
                }
            }

            
        }
        return update;
    }

    toggleT() { // switch the graph to show TEMPERATURE
        this.setState({
            showTemp: true,
            showHmid: false,
            showPres: false,
        });
    }

    toggleH() { // switch the graph to show HUMIDITY
        this.setState({
            showTemp: false,
            showHmid: true,
            showPres: false,
        });
    }

    toggleP() { // switch  the graph to show PRESSURE
        this.setState({
            showTemp: false,
            showHmid: false,
            showPres: true,
        });
    }

    render() {

        // create new elements for new data points.  but only sometimes for performance.

        if(this.state.time.getTime() % 100 < 25) {
            let elementT = {
                x: this.state.time.getTime() / 1000,
                y: this.state.lastTemp
            }
            let elementP = {
                x: this.state.time.getTime() / 1000,
                y: this.state.lastPres
            }
            let elementH = {
                x: this.state.time.getTime() / 1000,
                y: this.state.lastHmid
            }

            this.state.cubeDataT.data.push(elementT);
            this.state.cubeDataP.data.push(elementP);
            this.state.cubeDataH.data.push(elementH);
        }
        

        this.state.cubeData = [];

        let graphMax = this.state.time.getTime() / 1000 ?? 10;
        let graphMin = graphMax - 5;

        if(graphMax < 5) {
            graphMax = 5;
            graphMin = 0;
        }
        this.state.cubeDataT.data = this.state.cubeDataT.data.filter(function(input) {
            return input.x > graphMin;
        });
        this.state.cubeDataH.data = this.state.cubeDataH.data.filter(function(input) {
            return input.x > graphMin;
        });
        this.state.cubeDataP.data = this.state.cubeDataP.data.filter(function(input) {
            return input.x > graphMin;
        });

        if(this.state.showPres) { // if this graph is set to show PRESSURE, add the pressure data to the data array & change the legend to match
            if(!this.state.dark) {
                this.state.cubeDataT.color = 'red'; // data series color for light mode
            } else {
                this.state.cubeDataT.color = 'red'; // data series color for dark mode
            }
            this.state.cubeData.push(this.state.cubeDataP); // add the data series to the graph's array
            this.state.legendString = "Pressure"; // define basis of legend
            if(this.props.showMetric) { // adjust legend to the correct units
                this.state.legendString = this.state.legendString.concat(" (mBar)");
            } else {
                this.state.legendString = this.state.legendString.concat(" (inHg)");
            }
        }
        
        if(this.state.showHmid) { // if this graph is set to HUMIDITY, add the data.  HMID only has one unit
            if(!this.state.dark) {
                this.state.cubeDataT.color = 'orange';
            } else {
                this.state.cubeDataT.color = 'orange';
            }
            this.state.cubeData.push(this.state.cubeDataH);
            this.state.legendString = "Humidity (%)";
            // if(this.props.showMetric) { // adjust legend to the correct units
            //     this.state.legendString = this.state.legendString.concat(" (mBar)");
            // } else {
            //     this.state.legendString = this.state.legendString.concat(" (inHg)");
            // }
        }


        if(this.state.showTemp) { // handle TEMPERATURE.  see above
            if(!this.state.dark) {
                this.state.cubeDataT.color = 'green';
            } else {
                this.state.cubeDataT.color = 'green';
            }

            this.state.cubeData.push(this.state.cubeDataT);
            this.state.legendString = "Temperature";
            if(this.props.showMetric) {
                this.state.legendString = this.state.legendString.concat(" (°C)");
            } else {
                this.state.legendString = this.state.legendString.concat(" (°F)");
            }
        }


        // change the color of various elements depending on whether we're in light or dark mode 

        // tooltip text color
        let tooltipColor = null;
        if(this.props.dark) {
            tooltipColor = "#ffffff";
        } else {
            tooltipColor = "#000000";
        }

        // graph text color
        let textColor = null;
        if(this.props.dark) {
            textColor = "#ffffff";
        } else {
            textColor = "#000000";
        }

        // tooltip background
        let tooltipBG = null;
        if(this.props.dark) {
            tooltipBG = "#141414";
        } else {
            tooltipBG = "#607d8b";
        }


        return(
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{height:"66.625vh", width:"100%"}}>
                <div style={{height:"1.5vh"}}></div>
                <div className={"row"}>
                    <h3>{this.state.cubeName}</h3>

                    <h3 style={{position: "relative", left:"8vw"}}>RSSI: {this.state.RSSI} dBm</h3>

                    <div style={{position: "relative", left: "17vw", bottom: "-0.5vh"}} >
                        {/* <SignalIcon dark={this.props.dark} signalStrength={this.props.signalStrength}/> */}
                        <BarSignalIcon dark={this.props.dark} signalStrength={this.props.signalStrength}/>
                        {/* <BatteryIcon dark={this.props.dark} batteryPercent={this.props.batteryPercent}/> */}
                    </div>
                </div>
                <div style={{height:"17vh"}}>
                    <hr/>
                    <div className="row" style={{height:"10vh"}}>
                        
                    </div>
                    <div className="row">
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4 style={{fontSize:"2vh"}}>Temperature: {this.state.lastTemp} {this.state.showMetric ? "°C" : "°F"}</h4>
                        </div>
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4 style={{fontSize:"2vh"}}>Humidity: {this.state.lastHmid}%</h4>
                        </div>
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4 style={{fontSize:"2vh"}}>Pressure: {this.state.lastPres} {this.state.showMetric ? "mBar" : "inHg"}</h4>
                        </div>
                    </div>
                    
                </div>
                <div /* all the data from this cube */ >
                    <div className={"row"} style={{height: "29vh"}}>
                        <ResponsiveLine
                            className={this.props.dark ? "LineGraphDark" : "LineGraphLight"}
                            data={ this.state.cubeData }
                            margin={{ top: 20, right: 150, bottom: 60, left: 90 }}
                            xScale={{ type: 'linear', min: graphMin ?? 10, max: graphMax ?? 10 }}
                            xFormat=">-.2f"
                            yScale={{ type: 'linear', min: 0, max: 'auto' }}
                            // yScale={{ type: 'auto' }}
                            yFormat=">-.2f"
                            blendMode="normal"
                            animate={false}
                            nodeSize={10}
                            theme={{
                                textColor: textColor,
                                fontSize: '14px',
                                axis: {
                                    legend: {
                                        text: {
                                            fontSize: '14px',
                                        }   
                                    }
                                },
                                tooltip: {
                                    container: {
                                        background: tooltipBG,
                                        textColor: tooltipColor,
                                        fontSize: "14px"
                                    }
                                },
                            }}
                            colors={data => data.color}
                            axisTop={null}
                            axisRight={null}
                            enableGridX={false}
                            useMesh={true}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickValues: 5,
                                tickRotation: 0,
                                legend: "Time (seconds)",
                                legendPosition: 'middle',
                                legendOffset: 46,
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                fontSize: '14px',
                                legend: this.state.legendString,
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
                </div>
                <div style={{height: "5vh"}}/>
                <div className={"row"} style={{height:"5vh"}}>
                        <div style={{width:"11vw", textAlign: "center"}}>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleT()}>Temperature</button>
                        </div>
                        <div style={{width:"11vw", textAlign: "center"}}>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleH()}>Humidity</button>
                        </div>
                        <div style={{width:"11vw", textAlign: "center"}}>
                            <button className={this.props.dark ? "customButtonLg" : "customButtonLgLight"} onClick={() => this.toggleP()}>Pressure</button>
                        </div>
                    </div>
            </div>
        )
    }
}
