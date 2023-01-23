import React from 'react';
import { ResponsiveLine } from '@nivo/line';

export default class CubeDisplayPanel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
            cubeName: props.cubeName,
            lastTemp: props.lastTemp,
            lastHmid: props.lastHmid,
            lastPres: props.lastPres,
            showTemp: true,
            showHmid: false,
            showPres: false,
            cubeDataT: 
                {
                    id: "Temperature",
                    color: 'yellow',
                    data: [
                    ]
                },
            
            cubeDataH: 
                {
                    id: "Humidity",
                    color: 'orange',
                    data: [
                    ]
                },
            
            cubeDataP: 
                {
                    id: "Pressure",
                    color: 'red',
                    data: [
                        
                    ]
                },
            
            cubeData: [],
            legendString: "",
            showMetric: props.showMetric,
            time: props.vehicleClock,
        }
    }

    static getDerivedStateFromProps(props, current_state) { // update to new values if anything important has changed
        if(current_state.showMetric !== props.showMetric ||
            current_state.time !== props.vehicleClock ||
            current_state.lastHmid !== props.lastHmid ||
            current_state.lastPres !== props.lastPres ||
            current_state.lastTemp !== props.lastTemp) {
            
            if(props.vehicleClock.getTime() === 0){
                return {
                    dark: props.dark,
                    cubeName: props.cubeName,
                    lastTemp: props.lastTemp,
                    lastHmid: props.lastHmid,
                    lastPres: props.lastPres,
                    showTemp: true,
                    showHmid: false,
                    showPres: false,
                    cubeDataT: 
                        {
                            id: "Temperature",
                            color: 'yellow',
                            data: [
                            ]
                        },
                    
                    cubeDataH: 
                        {
                            id: "Humidity",
                            color: 'orange',
                            data: [
                            ]
                        },
                    
                    cubeDataP: 
                        {
                            id: "Pressure",
                            color: 'red',
                            data: [
                                
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
                }
            }

            
        }
    }

    toggleT() { // switch the graph to show TEMPERAUTURE
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

        if(this.state.time.getTime() % 500 == 0) { // 2hz
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

        if(this.state.cubeDataT.data[0].x < graphMin)
        {
            this.state.cubeDataT.data.shift();
        }
        if(this.state.cubeDataH.data[0].x < graphMin)
        {
            this.state.cubeDataH.data.shift();
        }
        if(this.state.cubeDataP.data[0].x < graphMin)
        {
            this.state.cubeDataP.data.shift();
        }

        if(this.state.showPres) { // if this graph is set to show PRESSURE, add the pressure data to the data array & change the legend to match
            this.state.cubeData.push(this.state.cubeDataP);
            this.state.legendString = "Pressure";
            if(this.props.showMetric) { // adjust legend to the correct units
                this.state.legendString = this.state.legendString.concat(" (mBar)");
            } else {
                this.state.legendString = this.state.legendString.concat(" (inHg)");
            }
        }
        
        if(this.state.showHmid) { // if this graph is set to HUMIDITY, add the data.  HMID only has one unit
            this.state.cubeData.push(this.state.cubeDataH);
            this.state.legendString = "Humidity (%)";

        }


        if(this.state.showTemp) { // handle TEMPERATURE.  see above
            this.state.cubeData.push(this.state.cubeDataT);
            this.state.legendString = "Temperature";
            if(this.props.showMetric) {
                this.state.legendString = this.state.legendString.concat(" (°C)");
            } else {
                this.state.legendString = this.state.legendString.concat(" (°F)");
            }
        }

        return(
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`} style={{height:"100%"}}>
                <div style={{height:"1vh"}}></div>
                <h4>{this.state.cubeName}</h4>
                <div style={{height:"17vh"}}>
                    <div className="row" style={{height:"10vh"}}>
                        
                    </div>
                    <div className="row">
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4>Temperature: {this.state.lastTemp} {this.state.showMetric ? "°C" : "°F"}</h4>
                        </div>
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4>Humidity: {this.state.lastHmid}%</h4>
                        </div>
                        <div style={{textAlign:"center", width:"11vw"}}>
                            <h4>Pressure: {this.state.lastPres} {this.state.showMetric ? "mBar" : "inHg"}</h4>
                        </div>
                    </div>
                    
                </div>
                <div /* all the data from this cube */ >
                    <div className={"row"} style={{height: "30vh"}}>
                        <ResponsiveLine
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
                            colors={data => data.color}
                            axisTop={null}
                            axisRight={null}
                            enableGridX={false}
                            useMesh={true}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
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
                            <button className={"customButtonLg"} onClick={() => this.toggleT()}>Temperature</button>
                        </div>
                        <div style={{width:"11vw", textAlign: "center"}}>
                            <button className={"customButtonLg"} onClick={() => this.toggleH()}>Humidity</button>
                        </div>
                        <div style={{width:"11vw", textAlign: "center"}}>
                            <button className={"customButtonLg"} onClick={() => this.toggleP()}>Pressure</button>
                        </div>
                    </div>
            </div>
        )
    }
}
