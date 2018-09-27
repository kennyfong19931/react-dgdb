import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <>
            <Card>
                <div id="chara-bg">
                    <img src="/img/index.jpg" id="unit-large" />
                </div>
                <CardContent>
                    <Typography align="center">
                        By: UCMM
                    </Typography>
                </CardContent>
            </Card>
        </>
    }
}