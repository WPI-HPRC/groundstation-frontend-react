import React from 'react';
import '../App.css';

/**
 *  The black screen that hides everything while loading animation plays
 */

export default class SpashScreen extends React.Component {

    render() {
        return(
            <>
                <div style={{width: "100%", height: "100%"}}>
                    <img alt="Splash Screen Background" src='splashBack.png' style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "100%", width: "100%"}}/>
                    <img alt="Opening animation" src="GroundStation_FrontEnd_OpeningAnimation_v2.gif"style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "100%", width: "100%"}}/>
                    <img alt="HPRC Logo" className="hidden" src='hprc logo red.png' style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "20%"}}/>
                    <h2 className="hidden" style={{margin: "auto"}}>
                        HPRC Groundstation V2
                    </h2>
                </div>
            </>
        )
    }
}