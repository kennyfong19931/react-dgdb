import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { parseColorTag, parseStory } from '../Util';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FilterList, KeyboardArrowRight } from '@material-ui/icons';

const styles = {
    squareAvatar: {
        borderRadius: 0
    },
};

const DrawUnitList = (unitList, filterList) => (
    <List>
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
                return result;
            } else {
                return true;
            }
        }).map((unit) => (
            <ListItem key={"unit-" + unit.draw_id} >
                <Avatar alt={unit.draw_id + " - " + unit.name} src={unit.image} style={styles.squareAvatar} />
                <div style={{ padding: "0 16px" }}>
                    <Typography variant="subheading" component={Link} to={"/unit/" + unit.draw_id}>{unit.draw_id + " - " + unit.name}</Typography>
                    <Typography color="textSecondary">{unit.detail}</Typography>
                    <div className="inline">{parseStory(unit.detailcn)}</div>
                </div>
            </ListItem>
        ))}
    </List>
);
DrawUnitList.propTypes = {
    unitList: PropTypes.array,
    filterList: PropTypes.array,
}
const DrawQuestList = (questList, filterList) => (
    <List>
        {questList.filter(quest => {
            let result = null;
            if (filterList.length > 0) {
                filterList.filter(filter => filter.type === "cate_type")
                    .map((filter) => {
                        let tempResult = false;
                        if (quest.area_cate_type == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                filterList.filter(filter => filter.type === "cate_id")
                    .map((filter) => {
                        let tempResult = false;
                        if (quest.area_cate_id == filter.value) {
                            tempResult = true;
                        }
                        if (result == null)
                            result = tempResult;
                        else
                            result = result && tempResult;
                    });
                if (result != null && !result)
                    return false;
                return result;
            } else {
                return true;
            }
        }).map((quest) => (
            <ListItem key={"quest-" + quest.quest_id} >
                <Avatar alt={quest.quest_name} src={quest.image} style={styles.squareAvatar} />
                <div style={{ padding: "0 16px" }}>
                    <Typography variant="subheading" component={Link} to={"/quest/" + quest.quest_id}>{parseColorTag(quest.quest_name, false)}</Typography>
                    <Typography color="textSecondary">{quest.story}</Typography>
                    <div className="inline">{parseStory(quest.storycn)}</div>
                </div>
            </ListItem>
        ))}
    </List>
);
DrawQuestList.propTypes = {
    questList: PropTypes.array,
    filterList: PropTypes.array,
}

export class Story extends React.Component {
    constructor(props) {
        super(props);
        this.addFilter = this.addFilter.bind(this);
        this.deleteFilter = this.deleteFilter.bind(this);

        this.state = {
            status: Constant.STATUS.LOADING,
            chipList: [{ label: "Early Days", type: "cate_id", value: 21100 }],
            jsonObj: {},
        };
    }

    addFilter = (e, type, filter) => {
        let label = e.target.textContent;

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

    drawQuestFilter = () => {
        let filterList = [];
        let output = [];
        this.state.jsonObj.quest.map((quest) => {
            if (filterList.filter(filter => filter.area_cate_id === quest.area_cate_id).length == 0) {
                filterList.push({
                    area_cate_id: quest.area_cate_id,
                    area_cate_name: parseColorTag(quest.area_cate_name, true),
                });
            }
        });
        filterList.map((filter, index) => {
            output.push(<Button key={"filter-cate-" + index} variant="outlined" onClick={(e) => this.addFilter(e, "cate_id", filter.area_cate_id)} style={{ borderRadius: 0 }}>{filter.area_cate_name}</Button>);
        });
        return output;
    }

    componentDidMount() {
        fetch(Constant.URL.STORY)
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
                <title>故事列表 - {Constant.COMMON.SITE_NAME}</title>

                <meta property="og:title" content="故事列表" />
                <meta property="og:description" content="Divine Gate 所有故事列表" />
            </Helmet>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumb}>故事列表</Typography>
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
                            <Paper elevation={1} style={{ margin: "20px 0", padding: "20px" }}>
                                <List>
                                    <ListItem >
                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                        <div style={{ padding: "0 16px" }}>
                                            <Typography className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" />
                                        </div>
                                    </ListItem>
                                    <ListItem >
                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                        <div style={{ padding: "0 16px" }}>
                                            <Typography className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" />
                                        </div>
                                    </ListItem>
                                    <ListItem >
                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                        <div style={{ padding: "0 16px" }}>
                                            <Typography className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" />
                                        </div>
                                    </ListItem>
                                    <ListItem >
                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                        <div style={{ padding: "0 16px" }}>
                                            <Typography className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" />
                                        </div>
                                    </ListItem>
                                    <ListItem >
                                        <Avatar style={styles.squareAvatar} className="skeleton-background" />
                                        <div style={{ padding: "0 16px" }}>
                                            <Typography className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                            <Typography className="skeleton-background skeleton-lg" />
                                        </div>
                                    </ListItem>
                                </List>
                            </Paper>

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
                                            <Typography variant="subheading">Unit系列</Typography>
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
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">關卡類別</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 1)} style={{ borderRadius: 0 }}>普通地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 2)} style={{ borderRadius: 0 }}>單 / 雙周地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 3)} style={{ borderRadius: 0 }}>緊急地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 4)} style={{ borderRadius: 0 }}>降臨地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 5)} style={{ borderRadius: 0 }}>活動地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 6)} style={{ borderRadius: 0 }}>進化神殿</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 7)} style={{ borderRadius: 0 }}>無限迴廊</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 8)} style={{ borderRadius: 0 }}>銀幣地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 9)} style={{ borderRadius: 0 }}>合作地下城</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "cate_type", 10)} style={{ borderRadius: 0 }}>鑰匙地下城</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subheading">關卡系列</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            {this.drawQuestFilter()}
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <Paper elevation={1} style={{ margin: "20px 0", padding: "20px" }}>
                                {DrawUnitList(this.state.jsonObj.unit, this.state.chipList)}
                                {DrawQuestList(this.state.jsonObj.quest, this.state.chipList)}
                            </Paper>
                        </Grid>
                }
            })()}
        </Grid>
    }
}