import React from 'react';
import '../App.css';

export default class SpashScreen extends React.Component {

    render() {
        return(
            <>
                <div style={{width: "100%", height: "100%"}}>
                    <img src='splashBack.png' style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "100%", width: "100%"}}/>
                    <img src='hprc logo red.png' style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "20%"}}/>
                    <h2 className="hidden" style={{margin: "auto"}}>
                        HPRC Groundstation V2
                    </h2>
                </div>
            </>
        )
    }
}