import React from 'react';


function ControlPanel (props) {

    return (
        <div className="panel">
            <div className={props.className}>
                <h3>Controls</h3>
            </div>
        </div>
    );
}

export default ControlPanel;