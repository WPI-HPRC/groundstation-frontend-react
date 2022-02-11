import React from 'react';


export default class Visualization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dark: props.dark,
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.dark !== props.dark) {
            return {
                dark: props.dark,
            }
        }
        return null
    }

    render() {
        return (
            <div className={`panel ${this.state.dark ? "darkPanel" : "lightPanel"}`}>
                <div className="Visualization">
                    <h3>Map   |    3D</h3>
                </div>
            </div>
        );
    }
}