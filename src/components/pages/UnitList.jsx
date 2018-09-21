import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { UnitIcon, b64_to_json } from '../Util';
import Masonry from 'react-masonry-component';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FilterList, KeyboardArrowRight } from '@material-ui/icons';

const DrawUnitList = (unitList, filterList) => (
    <>
        {unitList.filter(unit => {
            let result = null;
            if (filterList.length > 0) {
                filterList.filter(filter => filter.type === "series")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.series != null && unit.series.indexOf(filter.value) > -1) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "rare")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.rare == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "elem")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.element == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "kind")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.kind == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "subkind")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.sub_kind == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "hvlink")
                    .map((filter) => {
                        let tempResult = false;
                        if (unit.link_enable == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result == null)
                    result = false;
                return result;
            } else {
                return true;
            }
        }).map((unit) => (
            <UnitIcon key={"unit" + unit.draw_id} name={unit.name} draw_id={unit.draw_id} image={unit.image} size={50} lazy={true} />
        ))}
    </>
);
DrawUnitList.propTypes = {
    unitList: PropTypes.array,
    filterList: PropTypes.array,
}

export class UnitList extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
        this.addFilter = this.addFilter.bind(this);
        this.deleteFilter = this.deleteFilter.bind(this);

        let defaultSeries = [{ label: "再醒", type: "series", value: "再醒" }];
        if (this.urlParams.series) {
            let seriesObj = b64_to_json(this.urlParams.series);
            defaultSeries = [{ label: seriesObj.label, type: "series", value: seriesObj.value }];
        }

        this.state = {
            status: Constant.STATUS.LOADING,
            chipList: defaultSeries,
            jsonObj: {}
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    addFilter = (e, type, filter) => {
        let label = e.target.textContent;
        if (type == "elem")
            label = label + "屬性";
        else if (type == "kind")
            label = "種族: " + label;
        else if (type == "subkind")
            label = "副種族: " + label;

        let newItem = { label: label, type: type, value: filter };

        if (!this.state.chipList.some(item => { return item.type === type && item.value === filter })) {
            this.setState({ chipList: [...this.state.chipList, newItem] });
        }
    }

    deleteFilter = (e, index) => {
        const chipList = [...this.state.chipList];
        chipList.splice(index, 1);
        this.setState({ chipList: chipList });
    };

    componentDidMount() {
        fetch(Constant.URL.UNITLIST)
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
                <title>Unit列表 - {Constant.COMMON.SITE_NAME}</title>

                <meta property="og:title" content="Unit列表" />
                <meta property="og:description" content="Divine Gate 所有Unit列表" />
            </Helmet>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumb}>Unit列表</Typography>
            </Paper>
            {(() => {
                switch (this.state.status) {
                    case Constant.STATUS.LOADING:
                        return <Grid item xs>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<FilterList />}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={1}>
                                            <Typography variant="headline">篩選</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <div className="skeleton-background skeleton-sm" />
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelSummary>
                            </ExpansionPanel>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<FilterList />}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={1}>
                                            <Typography variant="headline">篩選</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            {this.state.chipList.map((item, index) => {
                                                return <Chip label={item.label} onDelete={(e) => this.deleteFilter(e, index)} key={"chip-" + index} />
                                            })}
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={24}>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">稀有度</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "0")} style={{ borderRadius: 0 }}>★1</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "1")} style={{ borderRadius: 0 }}>★2</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "2")} style={{ borderRadius: 0 }}>★3</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "3")} style={{ borderRadius: 0 }}>★4</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "4")} style={{ borderRadius: 0 }}>★5</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "5")} style={{ borderRadius: 0 }}>★6</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "rare", "6")} style={{ borderRadius: 0 }}>★7</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">屬性</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "2")} style={{ borderRadius: 0 }}>炎</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "3")} style={{ borderRadius: 0 }}>水</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "6")} style={{ borderRadius: 0 }}>風</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "4")} style={{ borderRadius: 0 }}>光</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "5")} style={{ borderRadius: 0 }}>暗</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "1")} style={{ borderRadius: 0 }}>無</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">種族</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "1")} style={{ borderRadius: 0 }}>人</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "2")} style={{ borderRadius: 0 }}>龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "3")} style={{ borderRadius: 0 }}>神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "4")} style={{ borderRadius: 0 }}>魔物</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "5")} style={{ borderRadius: 0 }}>妖精</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "6")} style={{ borderRadius: 0 }}>獸</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "7")} style={{ borderRadius: 0 }}>機械</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "kind", "8")} style={{ borderRadius: 0 }}>強化合成</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">副種族</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "1")} style={{ borderRadius: 0 }}>人</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "2")} style={{ borderRadius: 0 }}>龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "3")} style={{ borderRadius: 0 }}>神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "4")} style={{ borderRadius: 0 }}>魔物</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "5")} style={{ borderRadius: 0 }}>妖精</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "6")} style={{ borderRadius: 0 }}>獸</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "7")} style={{ borderRadius: 0 }}>機械</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "subkind", "8")} style={{ borderRadius: 0 }}>強化合成</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">Link</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "hvlink", "2")} style={{ borderRadius: 0 }}>可Link</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">系列</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "降臨")} style={{ ...{ borderRadius: 0 }, ...theme.palette.orange }}>降臨</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "亂入")} style={{ ...{ borderRadius: 0 }, ...theme.palette.orange }}>亂入</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "限定")} style={{ ...{ borderRadius: 0 }, ...theme.palette.orange }}>限定</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "再醒")} style={{ ...{ borderRadius: 0 }, ...theme.palette.orange }}>再醒</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "主角")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>主角</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "刃龍")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>刃龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "元素")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>元素</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "波克魯")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>波克魯</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "貓")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>貓</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "第三世代")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>第三世代</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "刑者")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>刑者</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "乙女")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>乙女</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "轉色獸")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>轉色獸</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "進化素材")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>進化素材</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "蛋")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>蛋</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "第四世代")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>第四世代</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "萬聖節")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>萬聖節</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "童話")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>童話</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "花之妖精")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>花之妖精</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "聖誕節")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>聖誕節</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "四次元")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>四次元</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "浴室美女")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>浴室美女</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "情人節")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>情人節</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "文明龍")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>文明龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "白色情人節")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>白色情人節</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "番人")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>番人</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "狐嫁")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>狐嫁</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "墮聖之結婚式")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>墮聖之結婚式</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "花獸")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>花獸</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "七夕")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>七夕</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "子彈")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>子彈</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "樂奏龍 ")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>樂奏龍 </Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "病神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>病神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "中秋節")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>中秋節</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "失工場")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>失工場</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "保護區")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>保護區</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "賞櫻")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>賞櫻</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "聖門學園")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>聖門學園</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "升技素材")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>升技素材</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "EarlyDays")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>EarlyDays</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "Link素材")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>Link素材</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "災害對策部")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>災害對策部</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "梅塔波")} style={{ ...{ borderRadius: 0 }, ...theme.palette.teal }}>梅塔波</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "機械龍")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>機械龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "精靈王")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>精靈王</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "圓桌騎士")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>圓桌騎士</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "天才")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>天才</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "機械娘")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>機械娘</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "綠野仙蹤")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>綠野仙蹤</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "拘束獸")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>拘束獸</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "特務龍")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>特務龍</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "六魔將")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>六魔將</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "聖劇之戲曲")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>聖劇之戲曲</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "北歐神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>北歐神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "六波羅")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>六波羅</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "六神通")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>六神通</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "調聖者")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>調聖者</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "新世界評議會")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>新世界評議會</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "數字")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>數字</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "天氣術師")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>天氣術師</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "畫伯")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>畫伯</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "神獸者")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>神獸者</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "水著")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>水著</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "雙子")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>雙子</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "三藝神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>三藝神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "BD2016")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>BD2016</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "裏古龍眾")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>裏古龍眾</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "創醒之巫女")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>創醒之巫女</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔獸士")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>魔獸士</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "刻命神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.red }}>刻命神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "命運石之門")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>命運石之門</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "妖精的尾巴")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>妖精的尾巴</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "進擊的巨人")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>進擊的巨人</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "公主踢")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>公主踢</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔法禁書目錄")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>魔法禁書目錄</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "Appli-Style")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Appli-Style</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "Psycho-Pass")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Psycho-Pass</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "約會大作戰")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>約會大作戰</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "WEGO")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>WEGO</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "初音未來")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>初音未來</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "GungHo")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>GungHo</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔法少女小圓")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>魔法少女小圓</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "無頭騎士異聞錄")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>無頭騎士異聞錄</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "IS")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Infinite Stratos</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "FSN")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Fate/stay night</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "征龍之路")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>征龍之路</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "NGNL")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>No Game No Life</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔法科高中的劣等生")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>魔法科高中的劣等生</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "黑色子彈")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>黑色子彈</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "偽戀")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>偽戀</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "槍彈辯駁")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>槍彈辯駁</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "攻殻")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>攻殻機動隊</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "噬血狂襲")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>噬血狂襲</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "EVA")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>新世紀福音戰士</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "好想大聲說出心底的話")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>好想大聲說出心底的話</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "鋼之鍊金術師")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>鋼之鍊金術師</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "七大罪")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>七大罪</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "重裝武器")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>重裝武器</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "斬！赤紅之瞳")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>斬！赤紅之瞳</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "灼眼的夏娜")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>灼眼的夏娜</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "血界戰線")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>血界戰線</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "死神")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>死神</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "阿松")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>阿松</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "Re0")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Re：從零開始的異世界生活</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "VV")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>Village Vanguard</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔奇少年")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>魔奇少年</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "果青")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>果然我的青春戀愛喜劇搞錯了。</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "魔伊")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>魔法少女☆伊莉雅3rei</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "午睡公主")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>午睡公主</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "美好世界")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>為世界獻上美好的祝福2</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "點兔")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>請問您今天要來點兔子嗎？？</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "series", "劍姬神聖譚")} style={{ ...{ borderRadius: 0 }, ...theme.palette.blue }}>在地下城尋求邂逅是否搞錯了什麼 外傳 劍姬神聖譚</Button>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <Paper elevation={1} style={{ margin: "20px 0", padding: "20px" }} component={Masonry}>
                                {DrawUnitList(this.state.jsonObj, this.state.chipList)}
                            </Paper>
                        </Grid>
                }
            })()}
        </Grid>
    }
}