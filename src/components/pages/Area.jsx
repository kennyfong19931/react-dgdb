import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { parseColorTag } from '../Util';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowRight } from '@material-ui/icons';

const DrawQuest = (list) => (
    list.map((map) => {
        return <Grid item xs={12} md={4} key={map.quest_id}>
            <Card>
                <CardActionArea component={Link} to={"/quest/" + map.quest_id}>
                    <CardContent>
                        <Typography gutterBottom variant="headline">{parseColorTag(map.quest_name, false)}</Typography>
                        <Typography>入場要求: 體力: {map.quest_stamina} 券: {map.quest_ticket} 鑰匙:{map.quest_key}</Typography>
                        <Typography>關卡層數: {map.floor_count}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    })
)
DrawQuest.propTypes = {
    list: PropTypes.array,
}

export class Area extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
        this.state = {
            status: Constant.STATUS.LOADING,
            jsonObj: {}
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    componentDidMount() {
        fetch(Constant.URL.AREA + this.urlParams.id)
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
            {(() => {
                switch (this.state.status) {
                    case Constant.STATUS.LOADING:
                        return <Grid item xs>
                            <Paper style={theme.palette.primary} className="breadcrumb">
                                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <div className="skeleton-background skeleton-sm" />
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <div className="skeleton-background skeleton-sm" />
                            </Paper>
                            <div className="full-width" style={{ height: "25vw" }} />
                            <div className="map">
                                <Grid container spacing={24} className="content">
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Grid container spacing={24}>
                                                    <Grid item className="inline info-box-key">
                                                        <div className="skeleton-background" style={{ height: "128px", width: "128px" }} />
                                                        <div className="skeleton-background" style={{ height: "128px", width: "128px" }} />
                                                    </Grid>
                                                    <Grid item>
                                                        <div className="skeleton-background skeleton-md" style={{ marginBottom: "10px" }} />
                                                        <div className="skeleton-background skeleton-lg" />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card>
                                            <CardContent>
                                                <div className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-md" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-sm" />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card>
                                            <CardContent>
                                                <div className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-md" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-sm" />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card>
                                            <CardContent>
                                                <div className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-md" style={{ marginBottom: "10px" }} />
                                                <div className="skeleton-background skeleton-sm" />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs>
                            <Helmet>
                                <title>{this.state.jsonObj.area + " - " + Constant.COMMON.SITE_NAME}</title>
                
                                <meta property="og:title" content={this.state.jsonObj.area} />
                                <meta property="og:description" content={this.state.jsonObj.area + '資料'} />
                                <meta property="og:image" content={"/img/area/" + this.state.jsonObj.area_res_map + "_upper.png"} />
                                <meta property="og:image" content={"/img/area/" + this.state.jsonObj.area_res_map + "_lower.png"} />
                                <meta property="og:image" content={"/img/panel/" + this.state.jsonObj.area_res_icon_key + ".png"} />
                                <meta property="og:image" content={"/img/panel/" + this.state.jsonObj.area_res_icon_box + ".png"} />
                            </Helmet>
                            <Paper style={theme.palette.primary} className="breadcrumb">
                                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumbLast} component="div">{this.state.jsonObj.area_cate_name}</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumbLast} component="div">{this.state.jsonObj.area}</Typography>
                            </Paper>
                            <img className="full-width" src={"/img/area/" + this.state.jsonObj.area_res_map + "_upper.png"} />
                            <div className="map">
                                <img className="full-width" src={"/img/area/" + this.state.jsonObj.area_res_map + "_lower.png"} />
                                <Grid container spacing={24} className="content">
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Grid container spacing={24}>
                                                    <Grid item className="inline info-box-key">
                                                        <CardMedia className="img" image={"/img/panel/" + this.state.jsonObj.area_res_icon_key + ".png"} title="區域鑰匙" />
                                                        <CardMedia className="img" image={"/img/panel/" + this.state.jsonObj.area_res_icon_box + ".png"} title="區域寶箱" />
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography gutterBottom variant="headline">地下城中各色卡片出現機率</Typography>
                                                        <div className="inline">
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/fire.jpg" />} label={this.state.jsonObj.area_element_fire + "%"} style={theme.palette.red} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/water.jpg" />} label={this.state.jsonObj.area_element_water + "%"} style={theme.palette.blue} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/wind.jpg" />} label={this.state.jsonObj.area_element_wind + "%"} style={theme.palette.green} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/light.jpg" />} label={this.state.jsonObj.area_element_light + "%"} style={theme.palette.yellow} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/dark.jpg" />} label={this.state.jsonObj.area_element_dark + "%"} style={theme.palette.purple} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/none.jpg" />} label={this.state.jsonObj.area_element_none + "%"} style={theme.palette.white} />
                                                            <Chip avatar={<Avatar style={theme.palette.green} src="/img/icon/life.jpg" />} label={this.state.jsonObj.area_element_life + "%"} style={theme.palette.pink} />
                                                        </div>
                                                        <br />
                                                        {this.state.jsonObj.area_url && <Button variant="contained" component="a" href={this.state.jsonObj.area_url} target="_blank" style={{ margin: "5px" }}>官方活動頁面: {this.state.jsonObj.area_cate_name}</Button>}
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    {DrawQuest(this.state.jsonObj.quest)}
                                </Grid>
                            </div>
                        </Grid>
                }
            })()}
        </Grid>
    }
}