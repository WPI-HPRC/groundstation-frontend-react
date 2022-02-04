import React from 'react';


export default class MissionStatus extends React.Component {
    state = {
        lightMode: false,
    }
    
    render() {
        return (
            <div className="panel" style={{backgroundColor: this.state.lightMode ? "#F7F7F7" : "#212121"}}>
                <div className="MissionStatus">
                    <h3>Mission Status</h3>
                    <hr/>
                </div>
            </div>
        );
    }
}