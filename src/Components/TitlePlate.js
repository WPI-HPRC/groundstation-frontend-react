import React from 'react';


function TitlePlate (props) {

    return (
        <div className="panel">
            <div className={props.className}>
                <h1 className="title">WPI <img src="hprc logo red.png" style={{height: "4vh", width: "3vh"}}/> HPRC</h1>
                <h4 className="subTitle">Aquila GS</h4>
            </div>
        </div>
    );
}

export default TitlePlate;