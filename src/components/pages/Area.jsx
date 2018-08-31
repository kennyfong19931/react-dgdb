import React from 'react';
import PropTypes from 'prop-types';

export class Area extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    render() {
        return <div>
            <h1>Area</h1>
            <p>{this.urlParams.id}</p>
        </div>
    }
}