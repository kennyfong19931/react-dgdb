import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { parseColorTag, parseStory, UnitIcon, TrapIcon } from '../Util';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { KeyboardArrowRight } from '@material-ui/icons';
import { Divider } from '@material-ui/core';

const styles = {
    slideStyle: {
        width: "100%",
        flexShrink: 0,
        overflow: "hidden",
    }
};

const DrawQuestRequirement = (obj) => {
    let itemList = [], elemList = [], kindList = [];

    if (obj.battle_chain)
        itemList.push(<ListItem key="quest-requirement-battle-chain"><ListItemText primary="連鎖戰鬥: 有" /></ListItem>);
    if (!obj.enable_continue)
        itemList.push(<ListItem key="quest-requirement-enable-continue"><ListItemText primary="不可使用硬幣復活" /></ListItem>);
    if (obj.elem_fire)
        elemList.push("火");
    if (obj.elem_water)
        elemList.push("水");
    if (obj.elem_wind)
        elemList.push("風");
    if (obj.elem_light)
        elemList.push("光");
    if (obj.elem_dark)
        elemList.push("暗");
    if (obj.elem_naught)
        elemList.push("無");
    if (elemList.length > 0) {
        let elemString = "禁止使用" + elemList.join(",") + "屬性以外的Unit";
        if (obj.num_elem)
            elemString += '(不能有副屬性)';
        itemList.push(<ListItem key="quest-requirement-elem"><ListItemText primary={elemString} /></ListItem>);
    }
    if (obj.kind_human)
        kindList.push("人類");
    if (obj.kind_fairy)
        kindList.push("妖精類");
    if (obj.kind_demon)
        kindList.push("魔物類");
    if (obj.kind_dragon)
        kindList.push("龍類");
    if (obj.kind_machine)
        kindList.push("機械類");
    if (obj.kind_beast)
        kindList.push("獸類");
    if (obj.kind_god)
        kindList.push("神類");
    if (obj.kind_egg)
        kindList.push("強化合成類");
    if (kindList.length > 0) {
        let kindString = "禁止使用" + kindList.join(",") + "以外的Unit";
        if (obj.num_kind)
            kindString += '(不能有副種族)';
        itemList.push(<ListItem key="quest-requirement-kind"><ListItemText primary={kindString} /></ListItem>);
    }
    if (obj.num_unit != 0)
        itemList.push(<ListItem key="quest-requirement-num-unit"><ListItemText primary={'只能攜帶' + obj.num_unit + '隻Unit闖關'} /></ListItem>);
    if (obj.much_name == 2)
        itemList.push(<ListItem key="quest-requirement-much-name"><ListItemText primary={'禁止使用同名Unit'} /></ListItem>);
    if (obj.limit_cost != 0)
        itemList.push(<ListItem key="quest-requirement-limit-cost"><ListItemText primary={'禁止使用' + (obj.limit_cost + 1) + ' COST或以上的Unit'} /></ListItem>);
    if (obj.limit_cost_total != 0)
        itemList.push(<ListItem key="quest-requirement-cost-total"><ListItemText primary={'隊伍COST禁止超越' + obj.limit_cost_total} /></ListItem>);
    if (obj.limit_unit_lv != 0)
        itemList.push(<ListItem key="quest-requirement-limit-unit-lv"><ListItemText primary={'禁止使用Lv' + obj.limit_unit_lv + '或以上的Unit'} /></ListItem>);
    if (obj.limit_unit_lv_total != 0)
        itemList.push(<ListItem key="quest-requirement-unit-lv-total"><ListItemText primary={'隊伍Lv.禁止超越' + obj.limit_unit_lv_total} /></ListItem>);
    if (obj.limit_rank != 0)
        itemList.push(<ListItem key="quest-requirement-limit-rank"><ListItemText primary={'RANK' + (obj.limit_rank - 1) + '以下禁止入場'} /></ListItem>);
    //rule_disable_as, rule_disable_ls, rule_heal_half, rule_disable_affinity
    if (obj.fix_team) {
        let fixTeamList = [];
        for (let i = 0; i < 5; i++) {
            let tempRow = [];

            if (obj.fix_team.fix_unit[i]) {
                let secondaryTest = "";
                let tag = '隊員: ';
                if (i == 0)
                    tag = '隊長: ';
                if (i == 4)
                    tag = '好友: ';

                if (obj.fix_team.fix_unit[i].plus_hp > 0 || obj.fix_team.fix_unit[i].plus_atk > 0)
                    secondaryTest = "HP+" + obj.fix_team.fix_unit[i].plus_hp + "/ATK+" + obj.fix_team.fix_unit[i].plus_atk;

                tempRow.push(<ListItemAvatar key={"fix-unit-" + i + "-avatar"}>
                    <UnitIcon name={obj.fix_team.fix_unit[i].unit.name} draw_id={obj.fix_team.fix_unit[i].unit.draw_id} image={obj.fix_team.fix_unit[i].unit.image} size={25} />
                </ListItemAvatar>);
                tempRow.push(<ListItemText key={"fix-unit-" + i + "-text"} primary={tag + obj.fix_team.fix_unit[i].unit.name + " Lv." + obj.fix_team.fix_unit[i].lv} secondary={secondaryTest} style={{ flexGrow: 0 }} />);
            }
            if (obj.fix_team.link_unit && obj.fix_team.link_unit[i]) {
                let secondaryTest = "";

                if (obj.fix_team.link_unit[i].plus_hp > 0 || obj.fix_team.link_unit[i].plus_atk > 0)
                    secondaryTest = "HP+" + obj.fix_team.link_unit[i].plus_hp + "/ATK+" + obj.fix_team.link_unit[i].plus_atk;

                tempRow.push(<ListItemAvatar key={"link-unit-" + i + "-avatar"}>
                    <UnitIcon name={obj.fix_team.link_unit[i].unit.name} draw_id={obj.fix_team.link_unit[i].unit.draw_id} image={obj.fix_team.link_unit[i].unit.image} size={25} />
                </ListItemAvatar>);
                tempRow.push(<ListItemText key={"link-unit-" + i + "-text"} primary={"Link: " + obj.fix_team.link_unit[i].unit.name + " Lv." + obj.fix_team.link_unit[i].lv} secondary={secondaryTest} style={{ flexGrow: 0 }} />);
            }
            if (tempRow.length > 0)
                fixTeamList.push(<ListItem key={"quest-requirement-fix-unit-row-" + i}>{tempRow}</ListItem>);
        }
        itemList.push(<List key="quest-requirement-fix-team" dense={true}>{fixTeamList}</List>);
    }
    return itemList;
}

DrawQuestRequirement.propTypes = {
    obj: PropTypes.object
}

const DrawRow = (row, key) => {
    let rowList = [];
    rowList.push(<TableRow key={key}>
        <TableCell><UnitIcon name={row.unit.name} draw_id={row.unit.draw_id} image={row.unit.image} /></TableCell>
        <TableCell>{row.hp}</TableCell>
        <TableCell>{row.atk}</TableCell>
        <TableCell>{row.def}</TableCell>
        <TableCell>{row.cd}</TableCell>
        <TableCell><UnitIcon name={row.drop.name} draw_id={row.drop.draw_id} image={row.drop.image} /></TableCell>
    </TableRow>);
    if (row.ability) {
        let abilityList = [];

        row.ability.map((ability, index) => {
            let primaryText = parseColorTag(ability.name);
            if (ability.detail)
                primaryText.push(<Typography key="ability-detail">{" - " + ability.detail}</Typography>);
            abilityList.push(<ListItem key={key + "-ability-" + index}><ListItemText primary={primaryText} secondary={parseColorTag(ability.detailcn)} /></ListItem>);
        });

        rowList.push(<TableRow key={key + '-ability'}>
            <TableCell>特性</TableCell>
            <TableCell colSpan="5"><List dense={true}>{abilityList}</List></TableCell>
        </TableRow>);
    }
    if (row.act_first) {
        let moveList = [];
        if (row.act_first.name)
            moveList.push(<Typography key={key + '-act-first-name'} component="strong">{row.act_first.name}</Typography>);
        moveList.push(<Typography key={key + '-act-first-detail'}>{row.act_first.detail}</Typography>);
        if (row.act_first.status_ailment) {
            row.act_first.status_ailment.map((sa, index) => {
                moveList.push(<Chip key={key + '-act-first-sa-' + index} avatar={<Avatar src={"/img/icon/" + sa.icon + ".png"} />} label={sa.detail} variant="outlined" />);
            });
        }
        rowList.push(<TableRow key={key + '-act-first'}>
            <TableCell>先制攻擊</TableCell>
            <TableCell colSpan="5"><div className="inline">{moveList}</div></TableCell>
        </TableRow>);
    }
    if (row.act_table) {
        row.act_table.map((act, index) => {
            let timimg = '';
            let actionType = '';
            let actList = [];

            if (act.timing_type == 1)
                timimg = 'HP≧0%';
            else if (act.timing_type == 2)
                timimg = 'HP≦' + act.timing_param1 + '%';
            else if (act.timing_type == 3)
                timimg = act.timing_param1 + '回合後';

            if (act.action_type == 1)
                actionType = '隨機使用以下技能：';
            else if (act.action_type == 2)
                actionType = '順序循環使用以下技能：';

            act.moves.map((move, index2) => {
                let primaryText = '';

                if (act.action_type == 1)
                    primaryText = '▪ ';
                else if (act.action_type == 2)
                    primaryText = (index2 + 1) + '. ';
                let moveItemList = [];
                if (move.name)
                    primaryText += move.name + ' - ';
                primaryText += move.detail;
                moveItemList.push(<ListItemText key={key + "-act-" + index + "-move-" + index2 + '-text'} primary={primaryText} style={{ flexGrow: 0 }} />);
                if (move.status_ailment) {
                    move.status_ailment.map((sa, index3) => {
                        moveItemList.push(<Chip key={key + "-act-" + index + "-move-" + index2 + '-sa' + index3} avatar={<Avatar src={"/img/icon/" + sa.icon + ".png"} />} label={sa.detail} variant="outlined" />);
                    });
                }
                actList.push(<ListItem key={key + "-act-" + index + "-move-" + index2}>{moveItemList}</ListItem>);
            });

            rowList.push(<TableRow key={key + "-act-" + index + "-move-list"}>
                <TableCell>{timimg}</TableCell>
                <TableCell colSpan="5">
                    <List key="quest-requirement-fix-team" dense={true} subheader={<ListSubheader>{actionType}</ListSubheader>}>
                        {actList}
                    </List>
                </TableCell>
            </TableRow>);
        });
    }
    if (row.act_dead) {
        let moveList = [];
        if (row.act_dead.name)
            moveList.push(<Typography key={key + '-act-dead-name'} component="strong">{row.act_dead.name}</Typography>);
        moveList.push(<Typography key={key + '-act-dead-detail'}>{row.act_dead.detail}</Typography>);
        if (row.act_dead.status_ailment) {
            row.act_dead.status_ailment.map((sa, index) => {
                moveList.push(<Chip key={key + '-act-dead-sa-' + index} avatar={<Avatar src={"/img/icon/" + sa.icon + ".png"} />} label={sa.detail} variant="outlined" />);
            });
        }
        rowList.push(<TableRow key={key + '-act-dead'}>
            <TableCell>死後攻擊</TableCell>
            <TableCell colSpan="5">{moveList}</TableCell>
        </TableRow>);
    }
    return rowList;
}
DrawRow.propTypes = {
    row: PropTypes.object,
    key: PropTypes.string,
}

const DrawTab = (floors) => {
    let tabList = [];
    for (let i = 0; i < floors.length; i++) {
        tabList.push(<Tab label={(i + 1) + "階"} key={"tab-" + (i + 1)} />);
    }
    return tabList
}
DrawTab.propTypes = {
    floors: PropTypes.array,
}

const DrawFloorRow = (star, row, key) => (
    <TableRow key={key}>
        {star < 7 && <TableCell>{star}★</TableCell>}
        {star == 7 && <TableCell>!</TableCell>}
        <TableCell>
            {row.enemy.map((enemy, index) => {
                return <UnitIcon name={enemy.name} draw_id={enemy.draw_id} image={enemy.image} key={key + "-enemy-" + star + "-" + index} />
            })}
        </TableCell>
        <TableCell>
            {row.trap.map((trap, index) => {
                return <TrapIcon name={trap.name} effective_type={trap.effective_type} effective_value={trap.effective_value} key={key + "-enemy-" + star + "-" + index} />
            })}
        </TableCell>
        <TableCell>
            <div className="inline">
                <img src={"/img/panel/" + row.money.icon + ".png"} width="40px" height="40px" />
                {row.money.min == 0 && <Typography>{row.money.max}円</Typography>}
                {row.money.min > 0 && <Typography>{row.money.min} ~ {row.money.max}円</Typography>}
            </div>
        </TableCell>
    </TableRow>
)
DrawFloorRow.propTypes = {
    star: PropTypes.number,
    row: PropTypes.object,
    key: PropTypes.string,
}
export class Quest extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
        this.state = {
            tab: 0,
            status: Constant.STATUS.LOADING,
            jsonObj: {}
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    handleChange = (event, value) => {
        this.setState({ tab: value });
    };

    handleChangeIndex = index => {
        this.setState({ tab: index });
    };

    componentDidMount() {
        fetch(Constant.URL.QUEST + this.urlParams.id)
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.status + " " + res.statusText);
                }
                return res.json();
            })
            .then((json) => this.setState({
                status: Constant.STATUS.SUCCESS,
                jsonObj: json,
                tab: json.floors.length - 1
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
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <div className="skeleton-background skeleton-sm" />
                            </Paper>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" /></Grid>
                                        <Grid item xs={12} md={4}><div className="skeleton-background skeleton-md" style={{ marginBottom: "20px" }} /></Grid>
                                    </Grid>
                                    <div className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "10px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-sm" style={{ marginBottom: "10px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                    <div className="skeleton-background skeleton-lg" style={{ marginBottom: "20px" }} />
                                </CardContent>
                            </Card>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs>
                            <Helmet>
                                <title>{parseColorTag(this.state.jsonObj.quest_name, true)} - {Constant.COMMON.SITE_NAME}</title>
                
                                <meta property="og:title" content={parseColorTag(this.state.jsonObj.quest_name, true)} />
                                <meta property="og:description" content={parseColorTag(this.state.jsonObj.quest_name, true) + '資料'} />
                            </Helmet>
                            <Paper style={theme.palette.primary} className="breadcrumb">
                                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumb} component="div">{this.state.jsonObj.area_cate_name}</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumb} component={Link} to={"/area/" + this.state.jsonObj.area_id}>{this.state.jsonObj.area_name}</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumbLast}>{parseColorTag(this.state.jsonObj.quest_name, false)}</Typography>
                            </Paper>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} md={4}><Typography>入場要求 - 體力: {this.state.jsonObj.quest_stamina}</Typography></Grid>
                                        <Grid item xs={12} md={4} className="inline">
                                            <Typography>入場要求 - 券: </Typography>
                                            <img src="/img/icon/ticket.png" style={{ width: "15px", height: "15px" }} />
                                            <Typography>{this.state.jsonObj.quest_ticket}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}><Typography>入場要求 - 鑰匙: {this.state.jsonObj.quest_key}</Typography></Grid>
                                        <Grid item xs={12} md={4} className="inline">
                                            <Typography>通關可獲金錢: </Typography>
                                            <img src="/img/icon/money.png" style={{ width: "15px", height: "15px" }} />
                                            <Typography>{this.state.jsonObj.clear_money}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}><Typography>通關可獲經驗值: {this.state.jsonObj.clear_exp}</Typography></Grid>
                                        <Grid item xs={12} md={4} className="inline">
                                            <Typography>通關可獲硬幣: </Typography>
                                            <img src="/img/icon/coin.png" style={{ width: "15px", height: "15px" }} />
                                            <Typography>{this.state.jsonObj.clear_stone}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}><Typography gutterBottom>通關可獲親密度: {this.state.jsonObj.clear_link_point}%</Typography></Grid>
                                        {this.state.jsonObj.clear_unit.draw_id != 0 && <Grid item xs={12} md={4} className="inline">
                                            <Typography>首次通關可獲得 Lv. {this.state.jsonObj.clear_unit.lv}的</Typography>
                                            <UnitIcon name={this.state.jsonObj.clear_unit.name} draw_id={this.state.jsonObj.clear_unit.draw_id} image={this.state.jsonObj.clear_unit.image} />
                                        </Grid>}

                                    </Grid>
                                    {this.state.jsonObj.quest_requirement && <>
                                        <Toolbar style={theme.palette.info}>
                                            <Typography variant="headline">關卡限制</Typography>
                                        </Toolbar>
                                        <Paper style={{ padding: "5px" }}>
                                            <List dense={true} className="quest-requirement">
                                                {DrawQuestRequirement(this.state.jsonObj.quest_requirement)}
                                            </List>
                                        </Paper>
                                    </>}

                                    <Toolbar style={theme.palette.grey}>
                                        <Typography variant="headline">故事</Typography>
                                    </Toolbar>
                                    <Paper style={{ padding: "5px" }}>
                                        <Typography>{this.state.jsonObj.story}</Typography>
                                        {this.state.jsonObj.storycn && <>
                                            <Divider style={{ margin: "2px" }} />
                                            <Typography>{parseStory(this.state.jsonObj.storycn)}</Typography>
                                        </>
                                        }
                                    </Paper>

                                    {this.state.jsonObj.noData == true && <>
                                        <Toolbar style={theme.palette.red}>
                                            <Typography variant="headline">BOSS</Typography>
                                        </Toolbar>
                                        <Paper style={{ padding: "5px" }}>

                                        </Paper>
                                    </>}
                                    {this.state.jsonObj.noData == false && <>
                                        <Toolbar style={theme.palette.red}>
                                            <Typography variant="headline">BOSS</Typography>
                                        </Toolbar>
                                        <Paper style={{ width: '100%', overflowX: 'auto', padding: "5px" }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Unit</TableCell>
                                                        <TableCell>HP</TableCell>
                                                        <TableCell>ATK</TableCell>
                                                        <TableCell>DEF</TableCell>
                                                        <TableCell>CD</TableCell>
                                                        <TableCell>掉落</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.jsonObj.boss.map((row, index) => DrawRow(row, "boss-" + index))}
                                                </TableBody>
                                            </Table>
                                        </Paper>

                                        <Toolbar style={theme.palette.purple}>
                                            <Typography variant="headline">小怪</Typography>
                                        </Toolbar>
                                        <Paper style={{ padding: "5px" }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Unit</TableCell>
                                                        <TableCell>HP</TableCell>
                                                        <TableCell>ATK</TableCell>
                                                        <TableCell>DEF</TableCell>
                                                        <TableCell>CD</TableCell>
                                                        <TableCell>掉落</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.jsonObj.enemy.map((row, index) => DrawRow(row, "enemy-" + index))}
                                                </TableBody>
                                            </Table>
                                        </Paper>

                                        <Toolbar style={theme.palette.teal}>
                                            <Typography variant="headline">格子分佈</Typography>
                                        </Toolbar>
                                        <Paper style={{ padding: "5px" }}>
                                            <Tabs value={this.state.tab} onChange={this.handleChange} textColor="secondary" fullWidth scrollable scrollButtons="auto">
                                                {DrawTab(this.state.jsonObj.floors)}
                                            </Tabs>
                                            <SwipeableViews
                                                index={this.state.tab}
                                                onChangeIndex={this.handleChangeIndex}
                                                slideStyle={styles.slideStyle}
                                            >
                                                {this.state.jsonObj.floors.map((row, index) => {
                                                    return <Table key={"floor" + index}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>格</TableCell>
                                                                <TableCell>出現 Unit</TableCell>
                                                                <TableCell>陷阱</TableCell>
                                                                <TableCell>金錢</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {DrawFloorRow(1, row[1], "floor-" + index + "-1")}
                                                            {DrawFloorRow(2, row[2], "floor-" + index + "-2")}
                                                            {DrawFloorRow(3, row[3], "floor-" + index + "-3")}
                                                            {DrawFloorRow(4, row[4], "floor-" + index + "-4")}
                                                            {DrawFloorRow(5, row[5], "floor-" + index + "-5")}
                                                            {DrawFloorRow(6, row[6], "floor-" + index + "-6")}
                                                            {DrawFloorRow(7, row[7], "floor-" + index + "-7")}
                                                        </TableBody>
                                                    </Table>
                                                })}
                                            </SwipeableViews>
                                        </Paper>
                                    </>}
                                </CardContent>
                            </Card>
                        </Grid>
                }
            })()}
        </Grid>
    }
}