import React from 'react';
import theme from '../../theme';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export class LoadingPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Paper style={theme.palette.info} className="inline box">
            <Typography color="inherit">Loading</Typography>
        </Paper>
    }
}