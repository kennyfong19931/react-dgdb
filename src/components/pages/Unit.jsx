import React from 'react';
import PropTypes from 'prop-types';

export class Unit extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    render() {
        return <div>
            <h1>Unit</h1>
            <p>{this.urlParams.id}</p>
        </div>
    }
}