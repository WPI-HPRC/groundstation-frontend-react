import React from 'react';


function TitlePlate (props) {

    return (
        <div className="panel">
            <div className={props.className}>
                <h1>WPI <img src="hprc logo red.png" style={{height: "4vh", width: "3vh"}}/> HPRC</h1>
                <h4>Aquila GS</h4>
            </div>
        </div>
    );
}

export default TitlePlate;