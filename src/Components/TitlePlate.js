import React from 'react';

/**
 *  plate in top-right which contains club name and logo
 *  Current: WPI <img> HPRC
 *           CAPRICORNUS GS
 */

export default class TitlePlate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if(current_state.dark !== props.dark) {
            return {
                dark: props.dark
            }
        }
        return null;
    }


    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="TitlePlate">
                    <h1 className="title">WPI <img alt="HPRC Logo" src="hprc logo red.png" style={{height: "4vh", width: "3vh"}}/> HPRC</h1>
                    <h4 className="subTitle">Capricornus GS</h4>
                </div>
            </div>
        );
    }
}
