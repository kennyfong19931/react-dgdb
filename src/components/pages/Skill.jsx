import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { getElement, parseColorTag, UnitIcon } from '../Util';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { FilterList, KeyboardArrowRight } from '@material-ui/icons';

const DrawSkillList = (skillList, filterList) => (
    <>
        {skillList && skillList.filter(skill => {
            let result = null;
            if (filterList.length == 0)
                return true;
            filterList.filter(filter => filter.type === "elem")
                .map((filter) => {
                    let tempResult = false;
                    if (skill.detailCn.indexOf(filter.value) > -1) {
                        tempResult = true;
                    }
                    if (result == null)
                        result = tempResult;
                    else
                        result = result && tempResult;
                });
            if (result != null && !result)
                return false;
            filterList.filter(filter => filter.type === "dmg")
                .map((filter) => {
                    let tempResult = false;
                    if (skill.detailCn.indexOf(filter.value) > -1) {
                        tempResult = true;
                    }
                    if (result == null)
                        result = tempResult;
                    else
                        result = result && tempResult;
                });
            if (result != null && !result)
                return false;
            filterList.filter(filter => filter.type === "extra")
                .map((filter) => {
                    let tempResult = false;
                    if (skill.detailCn.indexOf(filter.value) > -1) {
                        tempResult = true;
                    }
                    if (result == null)
                        result = tempResult;
                    else
                        result = result && tempResult;
                });
            if (result != null && !result)
                return false;
            filterList.filter(filter => filter.type === "card")
                .map((filter) => {
                    let tempResult = false;
                    if (skill.cardDesc.indexOf(filter.value) > -1) {
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
        }).map((skill, index) => (
            <TableRow key={index}>
                <TableCell>{skill.name}</TableCell>
                <TableCell><ListItemText primary={parseColorTag(skill.detail)} secondary={parseColorTag(skill.detailCn)} /></TableCell>
                {skill.card && <TableCell>
                    {skill.card.map((card, index2) => (
                        getElement(card, skill.name + "-card-" + index2)
                    ))}
                </TableCell>}
                <TableCell>
                    {skill.units.map((unit) => (
                        <UnitIcon key={index + "-unit-" + unit.draw_id} name={unit.name} draw_id={unit.draw_id} image={unit.image} size={50} lazy={true} />
                    ))}
                </TableCell>
            </TableRow>
        ))}
    </>
);
DrawSkillList.propTypes = {
    skillList: PropTypes.array,
    filterList: PropTypes.array,
}

export class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;

        this.skillCate = {
            "n": ["單體攻擊", "全體攻擊", "回復"],
            "ln": ["單體攻擊", "全體攻擊", "回復"],
            "l": ["攻擊力倍率", "血量倍率", "攻擊力及血量倍率", "追打", "傷害減免", "回合回血", "攻擊時間增加", "回復上升", "攻擊回血", "戰鬥回血", "按隊伍血量條件提升", "按combo達成條件提升", "根性", "降低所受傷害", "攻擊順序", "轉換技能", "按指定攻擊條件提升", "通關獲得經驗值增加"],
            "a": ["倍數攻擊", "攻擊後回復", "屬性攻擊", "犧牲攻擊", "機率攻擊", "固定攻擊", "屬性固定攻擊", "特殊攻擊", "中毒", "防禦破壞", "拖延", "防禦上升", "攻擊力強化", "時間延長", "屬性攻擊無效", "反擊", "卡板轉換", "回復", "HP 回復", "SP 回復", "CD減少", "傳送", "直接打開所有？格", "血量回復, 消除異常狀態", "放板格設置卡板"],
            "p": ["陷阱免疫", "按敵人種族提升", "反擊", "回復", "按隊伍血量條件提升", "不會發生Back attack", "防禦", "BOOST格出現率更變", "Panel出現率更變", "按手持的板減傷", "按攻擊Combo回復", "攻擊時間增加", "按Combo增加Rate", "根性", "移動時回復血量", "戰鬥時回復血量", "追打", "翻開地板後影響攻擊力", "多種屬性同時攻擊時、攻擊力上升", "按Combo增加攻擊力"],
            "lp": ["陷阱免疫", "按敵人種族提升", "反擊", "回復", "按隊伍血量條件提升", "不會發生Back attack", "防禦", "BOOST格出現率更變", "Panel出現率更變", "按手持的板減傷", "按攻擊Combo回復", "攻擊時間增加", "按Combo增加Rate", "根性", "移動時回復血量", "戰鬥時回復血量", "追打", "翻開地板後影響攻擊力", "多種屬性同時攻擊時、攻擊力上升", "按Combo增加攻擊力"],
        };

        this.state = {
            status: Constant.STATUS.LOADING,
            type: '',
            typeText: '',
            chipList: [],
            jsonObj: []
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.type !== prevState.type) {
            let typeText = '';
            switch (nextProps.match.params.type) {
                case 'n':
                    typeText = '普通';
                    break;
                case 'l':
                    typeText = '隊長';
                    break;
                case 'a':
                    typeText = '主動';
                    break;
                case 'p':
                    typeText = '普通被動';
                    break;
                case 'ln':
                    typeText = 'Link';
                    break;
                case 'lp':
                    typeText = 'Link被動';
                    break;
                default:
                    break;
            }
            return {
                type: nextProps.match.params.type,
                typeText: typeText
            };
        }
        return null
    }

    addFilter = (e, type, filter) => {
        let label = e.target.textContent;
        if (type == "elem")
            label = label + "屬性";
        else if (type == "dmg")
            label = "攻擊: " + label;
        else if (type == "card")
            label = "卡牌組合: " + label;
        else if (type == "extra")
            label = "附加: " + label;

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
        fetch(Constant.URL.SKILL + this.urlParams.type)
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.status + " " + res.statusText);
                }
                return res.json();
            })
            .then((json) => this.setState({
                status: Constant.STATUS.SUCCESS,
                jsonObj: json.skill
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
                <title>{this.state.typeText}技能一覽表 - {Constant.COMMON.SITE_NAME}</title>
                <meta property="og:title" content={this.state.typeText + "技能一覽表"} />
                <meta property="og:description" content={"Divine Gate 所有" + this.state.typeText + "技能列表"} />
            </Helmet>
            <Paper style={theme.palette.primary} className="breadcrumb">
                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                <Typography style={theme.palette.breadcrumb}>{this.state.typeText}技能一覽表</Typography>
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
                                <Toolbar>
                                    <Typography variant="headline"><div className="skeleton-background skeleton-md" /></Typography>
                                </Toolbar>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            {this.state.type == "n" && <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>}
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            <TableCell><div className="skeleton-background skeleton-lg" /></TableCell>
                                            {this.state.type == "n" && <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>}
                                            <TableCell><div className="skeleton-background skeleton-md" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            <TableCell><div className="skeleton-background skeleton-lg" /></TableCell>
                                            {this.state.type == "n" && <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>}
                                            <TableCell><div className="skeleton-background skeleton-md" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            <TableCell><div className="skeleton-background skeleton-lg" /></TableCell>
                                            {this.state.type == "n" && <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>}
                                            <TableCell><div className="skeleton-background skeleton-md" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>
                                            <TableCell><div className="skeleton-background skeleton-lg" /></TableCell>
                                            {this.state.type == "n" && <TableCell><div className="skeleton-background skeleton-sm" /></TableCell>}
                                            <TableCell><div className="skeleton-background skeleton-md" /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
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
                                            <Typography variant="subheading">屬性</Typography>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "炎屬性")} style={{ borderRadius: 0 }}>炎</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "水屬性")} style={{ borderRadius: 0 }}>水</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "風屬性")} style={{ borderRadius: 0 }}>風</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "光屬性")} style={{ borderRadius: 0 }}>光</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "暗屬性")} style={{ borderRadius: 0 }}>暗</Button>
                                            <Button variant="outlined" onClick={(e) => this.addFilter(e, "elem", "無屬性")} style={{ borderRadius: 0 }}>無</Button>
                                        </Grid>
                                        {(this.state.type == "n" || this.state.type == "ln") && <>
                                            <Grid item xs={1}>
                                                <Typography variant="subheading">攻擊</Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "小")} style={{ borderRadius: 0 }}>小</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "中")} style={{ borderRadius: 0 }}>中</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "大")} style={{ borderRadius: 0 }}>大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "特大")} style={{ borderRadius: 0 }}>特大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "超特大")} style={{ borderRadius: 0 }}>超特大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "絕大")} style={{ borderRadius: 0 }}>絕大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "超絕大")} style={{ borderRadius: 0 }}>超絕大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "極大")} style={{ borderRadius: 0 }}>極大</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "貫通")} style={{ borderRadius: 0 }}>貫通</Button>
                                            </Grid>
                                        </>}
                                        {this.state.type == "n" && <>
                                            <Grid item xs={1}>
                                                <Typography variant="subheading">卡牌組合</Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "單色")} style={{ borderRadius: 0 }}>單色</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "雜色")} style={{ borderRadius: 0 }}>雜色</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "1板")} style={{ borderRadius: 0 }}>1板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "2板")} style={{ borderRadius: 0 }}>2板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "3板")} style={{ borderRadius: 0 }}>3板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "4板")} style={{ borderRadius: 0 }}>4板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "5板")} style={{ borderRadius: 0 }}>5板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "炎板")} style={{ borderRadius: 0 }}>炎板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "水板")} style={{ borderRadius: 0 }}>水板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "風板")} style={{ borderRadius: 0 }}>風板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "光板")} style={{ borderRadius: 0 }}>光板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "暗板")} style={{ borderRadius: 0 }}>暗板</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "card", "無板")} style={{ borderRadius: 0 }}>無板</Button>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Typography variant="subheading">附加</Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "BOOST")} style={{ borderRadius: 0 }}>BOOST</Button>
                                                <Button variant="outlined" onClick={(e) => this.addFilter(e, "dmg", "特性")} style={{ borderRadius: 0 }}>特性</Button>
                                            </Grid>
                                        </>}
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <Paper elevation={1} style={{ margin: "20px 0", padding: "20px" }}>
                                {this.skillCate[this.state.type].map((value, index) => (
                                    <div key={index}>
                                        <Toolbar>
                                            <Typography variant="headline">{value}</Typography>
                                        </Toolbar>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ width: "16%" }}>技能名稱</TableCell>
                                                    <TableCell>技能內容</TableCell>
                                                    {this.state.type == "n" && <TableCell style={{ width: "16%" }}>卡牌組合</TableCell>}
                                                    <TableCell style={{ width: "42%" }}>所持 Unit</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {DrawSkillList(this.state.jsonObj[(index + 1)], this.state.chipList)}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}

                            </Paper>
                        </Grid>
                }
            })()}
        </Grid>
    }
}