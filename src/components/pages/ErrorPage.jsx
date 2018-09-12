import React from 'react';
import theme from '../../theme';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ErrorOutline } from '@material-ui/icons';

export class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Paper style={theme.palette.danger} className="inline box">
            <ErrorOutline /><Typography color="inherit">Error Occured. Please try again later.</Typography>
        </Paper>
    }
}