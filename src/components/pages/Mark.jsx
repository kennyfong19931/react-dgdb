import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowRight } from '@material-ui/icons';

export class Mark extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
        
        this.state = {
            type: props.match.params.type
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.type !== prevState.type) {
            return { type: nextProps.match.params.type }
        }
        return null;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.type !== this.state.type) {
            this.setState({ type: this.state.type });
        }
    }

    render() {
        return <Grid container spacing={24}>
            <Helmet>
                <title>DG點心紙 - {Constant.COMMON.SITE_NAME}</title>
                {this.state.type == "rare" && <script type="text/javascript" src="/js/rare.js"></script>}
                {this.state.type == "collabo" && <script type="text/javascript" src="/js/collabo.js"></script>}
                <script type="text/javascript" src="/js/mark_sheet.js"></script>

                <meta property="og:title" content="DG點心紙" />
                <meta property="og:description" content="標記擁有的Unit" />
            </Helmet>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumb}>DG點心紙</Typography>
            </Paper>
            <Grid item xs={12}>
                <Button className="imageput" style={{ ...{ margin: '2px' }, ...theme.palette.blue }}>取得圖片</Button>
                <Button className="allon" style={{ ...{ margin: '2px' }, ...theme.palette.green }}>全部選擇</Button>
                <Button className="alloff" style={{ ...{ margin: '2px' }, ...theme.palette.red }}>全部清除</Button>
                <Button style={{ ...{ margin: '2px' }, ...theme.palette.orange }} component={Link} to="/mark/rare">課金抽棋</Button>
                <Button style={{ ...{ margin: '2px' }, ...theme.palette.orange }} component={Link} to="/mark/collabo">合作抽棋</Button>
            </Grid>
            <Grid item xs={12}>
                <canvas id="list"></canvas>
                <canvas id="pre" style={{ display: 'none' }}></canvas>
            </Grid>
        </Grid>
    }
}