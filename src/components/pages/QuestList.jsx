import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { parseColorTag } from '../Util';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowRight } from '@material-ui/icons';

const styles = {
    squareAvatar: {
        borderRadius: 0
    },
    cardPadding: {
        padding: "10px"
    },
};

const DrawCardHeader = (type) => {
    switch (type) {
        case 1:
            return <CardHeader title="普通地下城" style={theme.palette.purple} />
        case 2:
            return <CardHeader title="單/雙周地下城" style={theme.palette.indigo} />
        case 3:
            return <CardHeader title="緊急地下城" style={theme.palette.red} />
        case 4:
            return <CardHeader title="降臨地下城" style={theme.palette.teal} />
        case 5:
            return <CardHeader title="活動地下城" style={theme.palette.green} />
        case 6:
            return <CardHeader title="進化神殿" style={theme.palette.amber} />
        case 7:
            return <CardHeader title="無限迴廊" style={theme.palette.grey} />
        case 8:
            return <CardHeader title="銀幣地下城" style={theme.palette.blueGrey} />
        case 9:
            return <CardHeader title="合作地下城" style={theme.palette.lightGreen} />
        case 10:
            return <CardHeader title="鑰匙地下城" style={theme.palette.cyan} />
        default:
            return <CardHeader title={type} />
    }
}
DrawCardHeader.propTypes = {
    type: PropTypes.number,
}

const DrawAreaCat = (type, list) => (
    <Card>
        {DrawCardHeader(type)}
        <CardContent style={styles.cardPadding}>
            <List subheader={<li />}>
                {list[type].map((cate, index) => {
                    return <ListSubheader key={type + "_" + cate.area_cate_type + "_" + index} disableGutters={true}>
                        {cate.area_cate_name}
                        {cate.areas && cate.areas.map((area) => {
                            return <ListItem key={area.area_id} component={Link} to={"/area/" + area.area_id} dense={true} disableGutters={true}>
                                <ListItemAvatar>
                                    <Avatar src={area.boss.image} alt={area.boss.name} style={styles.squareAvatar} />
                                </ListItemAvatar>
                                <ListItemText>
                                    <Typography>{parseColorTag(area.area_name, true)}</Typography>
                                </ListItemText>
                            </ListItem>
                        })}
                    </ListSubheader>
                })}
            </List>
        </CardContent>
    </Card>
)
DrawAreaCat.propTypes = {
    type: PropTypes.number,
    areaCate: PropTypes.array,
    list: PropTypes.array,
}

export class QuestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: Constant.STATUS.LOADING,
            jsonObj: {}
        };
    }

    componentDidMount() {
        fetch(Constant.URL.QUESTLIST)
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.status + " " + res.statusText);
                }
                return res.json();
            })
            .then((json) => this.setState({
                status: Constant.STATUS.SUCCESS,
                jsonObj: json
            }))
            .catch((err) => {
                console.log(err);
                this.setState({
                    status: Constant.STATUS.ERROR
                });
            });
    }

    render() {
        return <Grid container spacing={24}>
            <Helmet>
                <title>地下城列表 - {Constant.COMMON.SITE_NAME}</title>

                <meta property="og:title" content="地下城列表" />
                <meta property="og:description" content="Divine Gate 全地下城列表" />
            </Helmet>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumb}>地下城列表</Typography>
            </Paper>
            {(() => {
                switch (this.state.status) {
                    case Constant.STATUS.LOADING:
                        return <Grid item xs>
                            <Grid container spacing={24} className="content">
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card>
                                        <CardContent style={styles.cardPadding}>
                                            <List>
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card>
                                        <CardContent style={styles.cardPadding}>
                                            <List>
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card>
                                        <CardContent style={styles.cardPadding}>
                                            <List>
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListItem dense={true}>
                                                    <ListItemAvatar>
                                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                                    </ListItemAvatar>
                                                    <ListItemText className="skeleton-background skeleton-sm" />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card>
                                        <CardContent style={styles.cardPadding}>
                                            <List>
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                                <ListSubheader className="skeleton-background skeleton-md" />
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
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs>
                            <Grid container spacing={24} className="content">
                                <Grid item xs={12} sm={6} md={3}>
                                    {DrawAreaCat(1, this.state.jsonObj)}
                                    {DrawAreaCat(6, this.state.jsonObj)}
                                    {DrawAreaCat(7, this.state.jsonObj)}
                                    {DrawAreaCat(3, this.state.jsonObj)}
                                    {DrawAreaCat(5, this.state.jsonObj)}
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    {DrawAreaCat(4, this.state.jsonObj)}
                                    {DrawAreaCat(2, this.state.jsonObj)}
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    {DrawAreaCat(9, this.state.jsonObj)}
                                    {DrawAreaCat(10, this.state.jsonObj)}
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    {DrawAreaCat(8, this.state.jsonObj)}
                                </Grid>
                            </Grid>
                        </Grid>
                }
            })()}
        </Grid>
    }
}