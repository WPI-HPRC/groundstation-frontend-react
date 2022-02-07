import React from 'react';
import '../App.css';

export default class SpashScreen extends React.Component {

    render() {
        return(
            <>
                <div style={{position: "relative", textAlign: "center", width: "100hw", height: "100vh", backgroundColor: "#212121"}}>
                    <img src='hprc logo red.png' style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, margin: "auto", height: "20%"}}/>
                    <h2 className="hidden" style={{margin: "auto"}}>
                        HPRC Groundstation V2
                    </h2>
                </div>

            </>
        )
    }
}