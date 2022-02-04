import React from 'react';


function SystemPanel (props) {

    return (
        <div className="panel">
            <div className={props.className}>
                <h3>System</h3>
                <hr/>
            </div>
        </div>
    );
}

export default SystemPanel;