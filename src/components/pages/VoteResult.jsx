import React from 'react';
import PropTypes from 'prop-types';
import * as Constant from '../Constant';
import theme from '../../theme';
import { Link } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowRight, TrendingUp, TrendingDown, TrendingFlat, NewReleases } from '@material-ui/icons';

const styles = {
    squareAvatar: {
        borderRadius: 0
    },
    center: {
        textAlign: "center"
    },
    noPadding: {
        padding: 0
    },
    slideStyle: {
        width: "100%",
        flexShrink: 0,
        overflow: "hidden",
    }
};

const DrawRank = (type, change) => {
    switch (type) {
        case Constant.VOTE_RESULT_TYPE.UP:
            return <Chip avatar={<Avatar style={theme.palette.green}><TrendingUp /></Avatar>} label={change} style={theme.palette.green} />
        case Constant.VOTE_RESULT_TYPE.DOWN:
            return <Chip avatar={<Avatar style={theme.palette.red}><TrendingDown /></Avatar>} label={change} style={theme.palette.red} />
        case Constant.VOTE_RESULT_TYPE.EQUAL:
            return <Chip avatar={<Avatar style={theme.palette.yellow}><TrendingFlat /></Avatar>} label={change} style={theme.palette.yellow} />
        case Constant.VOTE_RESULT_TYPE.NEW:
            return <Chip avatar={<Avatar style={theme.palette.orange}><NewReleases /></Avatar>} label="新" style={theme.palette.orange} />
        default:
            return;
    }
}
DrawRank.propTypes = {
    type: PropTypes.string,
    change: PropTypes.number,
}

const DrawVoteResult = (list) => (
    <Grid container spacing={24}>
        {list.map((map) => {
            if (map.rank > 3)
                return;
            let tag = "";
            if (map.rank == 1) {
                tag = "第一名";
            } else if (map.rank == 2) {
                tag = "第二名";
            } else if (map.rank == 3) {
                tag = "第三名";
            }
            return <Grid item xs={12} md={4} key={map.rank + map.unit.draw_id}>
                <Typography variant="subheading" style={styles.center}>{tag}</Typography>
                <ListItem component={Link} to={"/unit/" + map.unit.draw_id} style={styles.noPadding}>
                    <ListItemAvatar>
                        <Avatar src={map.unit.image} alt={map.unit.name} style={styles.squareAvatar} />
                    </ListItemAvatar>
                    <ListItemText primary={map.unit.name} />
                    {DrawRank(map.type, map.change)}
                </ListItem>
            </Grid>
        })}
        <Grid item xs={12}><Divider /></Grid>
        <Grid item xs={12} className="multi-column"><List>
            {list.map((map) => {
                if (map.rank > 3) {
                    return <ListItem key={map.rank + map.unit.draw_id} component={Link} to={"/unit/" + map.unit.draw_id} dense={true}>
                        <ListItemAvatar>
                            <Avatar src={map.unit.image} alt={map.unit.name} style={styles.squareAvatar} />
                        </ListItemAvatar>
                        <ListItemText primary={map.rank + ". " + map.unit.name} />
                        {DrawRank(map.type, map.change)}
                    </ListItem>
                }
            })}
        </List></Grid>
    </Grid>
);
DrawVoteResult.propTypes = {
    list: PropTypes.array,
}

export class VoteResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab8th: 0,
            tab13rd: 0,
            status: Constant.STATUS.LOADING,
            jsonResult: {}
        };
    }
    handleChange8th = (event, value) => {
        this.setState({ tab8th: value });
    };

    handleChangeIndex8th = index => {
        this.setState({ tab8th: index });
    };
    handleChange13rd = (event, value) => {
        this.setState({ tab13rd: value });
    };

    handleChangeIndex13rd = index => {
        this.setState({ tab13rd: index });
    };

    componentDidMount() {
        Promise.all([
            fetch(Constant.URL.VOTE_RESULT + "1"),
            fetch(Constant.URL.VOTE_RESULT + "2"),
            fetch(Constant.URL.VOTE_RESULT + "3"),
            fetch(Constant.URL.VOTE_RESULT + "4"),
            fetch(Constant.URL.VOTE_RESULT + "5"),
            fetch(Constant.URL.VOTE_RESULT + "6"),
            fetch(Constant.URL.VOTE_RESULT + "7"),
            fetch(Constant.URL.VOTE_RESULT + "8"),
            fetch(Constant.URL.VOTE_RESULT + "9"),
            fetch(Constant.URL.VOTE_RESULT + "10"),
            fetch(Constant.URL.VOTE_RESULT + "11"),
            fetch(Constant.URL.VOTE_RESULT + "12"),
            fetch(Constant.URL.VOTE_RESULT + "13"),
        ]).then(([res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12, res13,]) => Promise.all([
            res1.json(),
            res2.json(),
            res3.json(),
            res4.json(),
            res5.json(),
            res6.json(),
            res7.json(),
            res8.json(),
            res9.json(),
            res10.json(),
            res11.json(),
            res12.json(),
            res13.json(),
        ])).then(([data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13,]) => this.setState({
            status: Constant.STATUS.SUCCESS,
            jsonResult: {
                1: data1,
                2: data2,
                3: data3,
                4: data4,
                5: data5,
                6: data6,
                7: data7,
                8: data8,
                9: data9,
                10: data10,
                11: data11,
                12: data12,
                13: data13,
            }
        })).catch((err) => {
            console.log(err);
            this.setState({
                status: Constant.STATUS.ERROR
            });
        });
    }
    render() {
        return <Grid container spacing={24}>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">Home</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumbLast} component="div">人氣投票結果</Typography>
            </Paper>
            {(() => {
                switch (this.state.status) {
                    case Constant.STATUS.LOADING:
                        return <Grid item xs>
                            <ExpansionPanel defaultExpanded={true}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.indigo}>
                                    <Typography>第十三回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subheading" style={styles.center}>第一名</Typography>
                                            <ListItem style={styles.noPadding}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subheading" style={styles.center}>第二名</Typography>
                                            <ListItem style={styles.noPadding}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subheading" style={styles.center}>第三名</Typography>
                                            <ListItem style={styles.noPadding}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={12}><Divider /></Grid>
                                        <Grid item xs={12} className="multi-column"><List>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                            <ListItem dense={true}>
                                                <ListItemAvatar>
                                                    <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                </ListItemAvatar>
                                                <ListItemText className="skeleton-background skeleton-sm" />
                                            </ListItem>
                                        </List></Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.blue}>
                                    <Typography>第十二回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.green}>
                                    <Typography>第十一回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.yellow}>
                                    <Typography style={theme.palette.yellow}>第十回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.orange}>
                                    <Typography>第九回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.red}>
                                    <Typography>第八回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.purple}>
                                    <Typography>第七回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.indigo}>
                                    <Typography>第六回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.blue}>
                                    <Typography>第五回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.green}>
                                    <Typography>第四回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.yellow}>
                                    <Typography style={theme.palette.yellow}>第三回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.orange}>
                                    <Typography>第二回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.red}>
                                    <Typography>第一回人氣投票</Typography>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs={12}>
                            <ExpansionPanel defaultExpanded={true}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.indigo}>
                                    <Typography>第十三回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Tabs value={this.state.tab13rd} onChange={this.handleChange13rd} textColor="secondary" fullWidth scrollable scrollButtons="auto">
                                                <Tab label="最喜歡的角色" style={theme.palette.yellow} />
                                                <Tab label="嬌起來很厲害" style={theme.palette.red} />
                                                <Tab label="會成為好伴侶" style={theme.palette.blue} />
                                                <Tab label="料理很厲害" style={theme.palette.green} />
                                            </Tabs>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SwipeableViews
                                                index={this.state.tab13rd}
                                                onChangeIndex={this.handleChangeIndex13rd}
                                                slideStyle={styles.slideStyle}
                                            >
                                                {DrawVoteResult(this.state.jsonResult[13]['fav'])}
                                                {DrawVoteResult(this.state.jsonResult[13]['tsundere'])}
                                                {DrawVoteResult(this.state.jsonResult[13]['wife'])}
                                                {DrawVoteResult(this.state.jsonResult[13]['cook'])}
                                            </SwipeableViews>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.blue}>
                                    <Typography>第十二回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[12])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.green}>
                                    <Typography>第十一回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[11])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.yellow}>
                                    <Typography style={theme.palette.yellow}>第十回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Paper elevation={1} style={theme.palette.info} className="inline box">
                                                <Typography color="inherit">是次排名是集計的，把各種進化、節日限定、衍生版本的票數合併計算</Typography>
                                            </Paper>
                                        </Grid>
                                        {DrawVoteResult(this.state.jsonResult[10])}
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.orange}>
                                    <Typography>第九回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Paper elevation={1} style={theme.palette.info} className="inline box">
                                                <Typography color="inherit">排名為</Typography><Typography color="inherit" component="a" href="http://dengekionline.com/elem/000/001/117/1117158/">電撃App 戦う！美少女キャラ総選挙 2015夏</Typography><Typography color="inherit">的結果</Typography>
                                            </Paper>
                                        </Grid>
                                        {DrawVoteResult(this.state.jsonResult[9])}
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.red}>
                                    <Typography>第八回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Tabs value={this.state.tab8th} onChange={this.handleChange8th} textColor="secondary" fullWidth scrollable scrollButtons="auto">
                                                <Tab label="總合" />
                                                <Tab label="炎屬性" style={theme.palette.red} />
                                                <Tab label="水屬性" style={theme.palette.blue} />
                                                <Tab label="風屬性" style={theme.palette.green} />
                                                <Tab label="光屬性" style={theme.palette.yellow} />
                                                <Tab label="暗屬性" style={theme.palette.purple} />
                                                <Tab label="無屬性" />
                                            </Tabs>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SwipeableViews
                                                index={this.state.tab8th}
                                                onChangeIndex={this.handleChangeIndex8th}
                                                slideStyle={styles.slideStyle}
                                            >
                                                {DrawVoteResult(this.state.jsonResult[8]['all'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['fire'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['water'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['wind'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['light'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['dark'])}
                                                {DrawVoteResult(this.state.jsonResult[8]['none'])}
                                            </SwipeableViews>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.purple}>
                                    <Typography>第七回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[7])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.indigo}>
                                    <Typography>第六回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[6])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.blue}>
                                    <Typography>第五回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[5])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.green}>
                                    <Typography>第四回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[4])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.yellow}>
                                    <Typography style={theme.palette.yellow}>第三回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[3])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.orange}>
                                    <Typography>第二回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[2])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={theme.palette.red}>
                                    <Typography>第一回人氣投票</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {DrawVoteResult(this.state.jsonResult[1])}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>;
                }
            })()}
        </Grid>
    }
}