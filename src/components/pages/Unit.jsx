import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { ErrorPage } from './ErrorPage';
import { parseColorTag, parseStory, json_to_b64, getElement, getKind, UnitIcon } from '../Util';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Add, ArrowRight, KeyboardArrowRight } from '@material-ui/icons';

const styles = {
    squareAvatar: {
        borderRadius: 0
    },
    white: {
        color: "#fff"
    },
};

const DrawStars = (rare) => {
    let output = [];
    for (let i = 0; i <= rare; i++) {
        output.push(<span key={"rare-" + i}>★</span>);
    }
    return output;
}
DrawStars.propTypes = {
    rare: PropTypes.number,
}

function getBgColor(element) {
    switch (element) {
        case 1:
            return "grey";
        case 2:
            return "red";
        case 3:
            return "blue";
        case 4:
            return "yellow";
        case 5:
            return "purple";
        case 6:
            return "green";
        case 7:
            return "pink";
    }
}

function getUnitValue(level, levelMax, levelMin, type, valueMin, valueMax, valueCurve = 0) {
    if (levelMin === levelMax) {
        return valueMax;
    } else {
        let pow;
        switch (valueCurve) {
            case 0:
            case 1:
            case 2:
                pow = 1;
                break;
            case 3:
                pow = 2.5;
                break;
            case 4:
            case 5:
            case 6:
                pow = 0.7;
                break;
            case 7:
            case 8:
            case 9:
                pow = 1.5;
                break;
            default:
                return '';
        }
        let diff = levelMax - levelMin;
        let levelDiff = level - levelMin;
        return Math.floor(valueMin + ((valueMax - valueMin) * Math.pow((levelDiff / diff), pow)));
    }
}

function getLinkUnitValue(partyCost, rare, elem, type, level, linkAtk, linkHp) {
    let v = 1 + (partyCost * 0.2) + ((rare + 1) * (rare + 1));
    let pow;
    switch (type) {
        case 0:
            pow = linkAtk / 100;
            break;
        case 2:
            pow = linkHp / 100;
            break;
    }
    return Math.floor(v * pow * (1 + (level * 0.03)));
}

function getLimitOverValue(grow, max, typeMax, level, type = null) {
    switch (grow) {
        case 0:
            grow = 0;
            break;
        case 1:
            grow = 1;
            break;
        case 2:
            grow = 0.7;
            break;
        case 3:
            grow = 1.5;
            break;
    }
    if (type == null) {
        return Math.round(typeMax * Math.pow((level / max), grow) * 100) / 100;
    } else if (type == 'charm') {
        return Math.floor(typeMax * Math.pow((level / max), grow) * 10) / 10;
    } else {
        return max;
    }
}

export class Unit extends React.Component {
    constructor(props) {
        super(props);
        this.urlParams = props.match.params;
        this.handleChangeLv = this.handleChangeLv.bind(this);
        this.handleChangeLinkLv = this.handleChangeLinkLv.bind(this);
        this.handleChangeLimitOverLv = this.handleChangeLimitOverLv.bind(this);
        this.state = {
            status: Constant.STATUS.LOADING,
            jsonObj: {},
            id: this.urlParams.id,
            lv: 1,
            linkLv: 1,
            limitOverLv: 1,
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    handleChangeLv = event => {
        this.setState({
            lv: event.target.value,
        });
    };

    handleChangeLinkLv = event => {
        this.setState({
            linkLv: event.target.value,
        });
    };

    handleChangeLimitOverLv = event => {
        this.setState({
            limitOverLv: event.target.value,
        });
    };

    componentDidMount() {
        fetch(Constant.URL.UNIT + this.state.id)
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.status + " " + res.statusText);
                }
                return res.json();
            })
            .then((json) => this.setState({
                status: Constant.STATUS.SUCCESS,
                jsonObj: json,
                id: json.id,
                lv: json.level_max,
                linkLv: json.level_max,
            }))
            .catch((err) => {
                console.log(err);
                this.setState({
                    status: Constant.STATUS.ERROR
                });
            });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id !== prevState.id) {
            return {
                id: nextProps.match.params.id,
            };
        }
        return null
    }

    componentDidUpdate(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({
                id: nextProps.match.params.id,
            });
            this.componentDidMount();
        }
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
                            </Paper>
                            <Card>
                                <CardContent>
                                    <div className="skeleton-background skeleton-md" />
                                </CardContent>
                            </Card>
                        </Grid>;
                    case Constant.STATUS.ERROR: return <Grid item xs><ErrorPage /></Grid>;
                    case Constant.STATUS.SUCCESS:
                        return <Grid item xs>
                            <Helmet>
                                <title>{this.state.jsonObj.name} - {Constant.COMMON.SITE_NAME}</title>

                                <meta property="og:title" content={this.state.jsonObj.name} />
                                <meta property="og:description" content={this.state.jsonObj.name + '資料'} />
                            </Helmet>
                            <Paper style={theme.palette.primary} className="breadcrumb">
                                <Typography style={theme.palette.breadcrumb} component={Link} to="/">主頁</Typography>
                                <KeyboardArrowRight style={theme.palette.breadcrumb} />
                                <Typography style={theme.palette.breadcrumbLast}>{this.state.jsonObj.name}</Typography>
                            </Paper>
                            <Card>
                                <CardMedia image="/img/chara_bg.jpg" title={this.state.jsonObj.id + " - " + this.state.jsonObj.name} id="chara-bg">
                                    <img src={this.state.jsonObj.image_large} id="unit-large" style={{ filter: "drop-shadow(10px 0px 1px " + getBgColor(this.state.jsonObj.element) + ")" }} />
                                </CardMedia>
                                <Toolbar style={theme.palette.primary}>
                                    <Avatar src={this.state.jsonObj.image_icon} alt={this.state.jsonObj.name} style={{ ...styles.squareAvatar, ...{ margin: "5px" } }} />
                                    <Typography variant="headline">{this.state.jsonObj.id + " - " + this.state.jsonObj.name}</Typography>
                                </Toolbar>
                                <CardContent>
                                    <Grid container spacing={24}>
                                        <Grid item xs><Typography>稀有度: {DrawStars(this.state.jsonObj.rare)}</Typography></Grid>
                                        <Grid item xs><Typography>屬性: {getElement(this.state.jsonObj.element)}</Typography></Grid>
                                        <Grid item xs><Typography>種族: {getKind(this.state.jsonObj.kind)}{this.state.jsonObj.sub_kind > 0 && " / " + getKind(this.state.jsonObj.sub_kind)}</Typography></Grid>
                                        <Grid item xs><Typography>隊伍 Cost: {this.state.jsonObj.party_cost}</Typography></Grid>
                                        <Grid item xs className="inline">
                                            <Typography>系列:</Typography>
                                            {this.state.jsonObj.series.map((text, index) => <Typography key={"series-" + index} component={Link} to={"/unitlist/" + json_to_b64({ "label": text, "value": text })} style={{ marginLeft: "2px", color: "#bbb" }}>{text}</Typography>)}</Grid>
                                    </Grid>
                                    <Grid container spacing={24}>
                                        <Grid item xs>
                                            <TextField label="等級" type="number" margin="normal"
                                                value={this.state.lv}
                                                onChange={this.handleChangeLv}
                                                InputLabelProps={{ shrink: true, }}
                                                inputProps={{
                                                    min: this.state.jsonObj.level_min,
                                                    max: this.state.jsonObj.level_max,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs><Typography>HP: {getUnitValue(this.state.lv, this.state.jsonObj.level_max, 1, 2, this.state.jsonObj.base_hp_min, this.state.jsonObj.base_hp_max, this.state.jsonObj.base_hp_curve)}</Typography></Grid>
                                        <Grid item xs><Typography>ATK: {getUnitValue(this.state.lv, this.state.jsonObj.level_max, 1, 0, this.state.jsonObj.base_attack_min, this.state.jsonObj.base_attack_max, this.state.jsonObj.base_attack_curve)}</Typography></Grid>
                                        <Grid item xs><Typography>所需經驗值: {getUnitValue(this.state.lv, this.state.jsonObj.level_max, 1, 3, 0, this.state.jsonObj.exp_total, this.state.jsonObj.exp_total_curve)}</Typography></Grid>
                                        <Grid item xs><Typography>售價: <img src="/img/icon/money.png" style={{ width: "15px", height: "15px" }} /> {getUnitValue(this.state.lv, this.state.jsonObj.level_max, 1, 5, this.state.jsonObj.sales_min, this.state.jsonObj.sales_max, this.state.jsonObj.sales_curve)} <img src="/img/icon/unit_point.png" style={{ width: "15px", height: "15px" }} alt="Unit Point" /> {this.state.jsonObj.sales_unitpoint}</Typography></Grid>
                                        <Grid item xs><Typography>飼料經: {getUnitValue(this.state.lv, this.state.jsonObj.level_max, 1, 4, this.state.jsonObj.blend_exp_min, this.state.jsonObj.blend_exp_max, this.state.jsonObj.blend_exp_curve)}</Typography></Grid>
                                    </Grid>
                                    <Grid container spacing={24}>
                                        <Grid item xs>
                                            <Typography>{this.state.jsonObj.detail}</Typography>
                                            {this.state.jsonObj.detailcn && <>
                                                <Divider style={{ margin: "2px" }} />
                                                <div className="inline">
                                                    {parseStory(this.state.jsonObj.detailcn)}
                                                </div>
                                            </>
                                            }
                                        </Grid>
                                    </Grid>
                                    <Toolbar style={theme.palette.purple}>
                                        <Typography variant="headline">隊長技能(LS){this.state.jsonObj.ls && (" - " + this.state.jsonObj.ls.name)}</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        {this.state.jsonObj.ls && <>
                                            <Typography>{this.state.jsonObj.ls.detail}</Typography>
                                            <Divider style={{ margin: "2px" }} />
                                            <Typography>{this.state.jsonObj.ls.detailcn}</Typography>
                                        </>}
                                        {!this.state.jsonObj.ls && <Typography>無</Typography>}
                                    </div>
                                    <Toolbar style={theme.palette.red}>
                                        <Typography variant="headline">主動技能(AS){this.state.jsonObj.as && (" - " + this.state.jsonObj.as.name)}</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        {this.state.jsonObj.as && <Grid container spacing={24}>
                                            <Grid item xs={2}><Typography>冷卻回合: {this.state.jsonObj.as.max} <ArrowRight /> {this.state.jsonObj.as.min}</Typography></Grid>
                                            <Grid item xs={10}>
                                                <Typography>{parseColorTag(this.state.jsonObj.as.detail, false)}</Typography>
                                                <Divider style={{ margin: "2px" }} />
                                                <Typography>{parseColorTag(this.state.jsonObj.as.detailcn, false)}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>擁有此技能的Unit: </Typography>
                                                {this.state.jsonObj.as.same && this.state.jsonObj.as.same.map((unit, index) => <UnitIcon key={"same-unit-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                            </Grid>
                                        </Grid>}
                                        {!this.state.jsonObj.as && <Typography>無</Typography>}
                                    </div>
                                    <Toolbar style={{ ...theme.palette.green, ...{ alignContent: "space-between" } }}>
                                        <Typography variant="headline" style={{ flex: 1 }}>普通技能1(NS1) - {this.state.jsonObj.ns1.name}</Typography>
                                        <>{this.state.jsonObj.ns1.card.map((elem, index) => getElement(elem, "ns1-card-" + index))}</>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        <Typography>{parseColorTag(this.state.jsonObj.ns1.detail, false)}</Typography>
                                        <Divider style={{ margin: "2px" }} />
                                        <Typography>{parseColorTag(this.state.jsonObj.ns1.detailcn, false)}</Typography>
                                    </div>
                                    {this.state.jsonObj.ns2 && <>
                                        <Toolbar style={{ ...theme.palette.green, ...{ alignContent: "space-between" } }}>
                                            <Typography variant="headline" style={{ flex: 1 }}>普通技能2(NS2) - {this.state.jsonObj.ns2.name}</Typography>
                                            <>{this.state.jsonObj.ns2.card.map((elem, index) => getElement(elem, "ns2-card-" + index))}</>
                                        </Toolbar>
                                        <div style={{ padding: "10px" }}>
                                            <Typography>{parseColorTag(this.state.jsonObj.ns2.detail, false)}</Typography>
                                            <Divider style={{ margin: "2px" }} />
                                            <Typography>{parseColorTag(this.state.jsonObj.ns2.detailcn, false)}</Typography>
                                        </div>
                                    </>}
                                    {this.state.jsonObj.ps && <>
                                        <Toolbar style={theme.palette.orange}>
                                            <Typography variant="headline">被動技能(PS) - {this.state.jsonObj.ps.name}</Typography>
                                        </Toolbar>
                                        <div style={{ padding: "10px" }}>
                                            <Typography>{this.state.jsonObj.ps.detail}</Typography>
                                            <Divider style={{ margin: "2px" }} />
                                            <Typography>{this.state.jsonObj.ps.detailcn}</Typography>
                                        </div>
                                    </>}
                                    <Toolbar style={theme.palette.grey}>
                                        <Typography variant="headline">Link (限界突破為Lv.0時)</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        {this.state.jsonObj.link && <>
                                            <Grid container spacing={24}>
                                                <Grid item xs><TextField label="等級" type="number" margin="normal"
                                                    value={this.state.linkLv}
                                                    onChange={this.handleChangeLinkLv}
                                                    InputLabelProps={{ shrink: true, }}
                                                    inputProps={{
                                                        min: this.state.jsonObj.level_min,
                                                        max: this.state.jsonObj.level_max,
                                                    }}
                                                /></Grid>
                                                <Grid item xs><Typography>Link Bonus(HP): {getLinkUnitValue(this.state.jsonObj.party_cost, this.state.jsonObj.rare, this.state.jsonObj.element, 2, this.state.linkLv, this.state.jsonObj.link.atk, this.state.jsonObj.link.hp)}+加蛋數量x2</Typography></Grid>
                                                <Grid item xs><Typography>Link Bonus(ATK): {getLinkUnitValue(this.state.jsonObj.party_cost, this.state.jsonObj.rare, this.state.jsonObj.element, 0, this.state.linkLv, this.state.jsonObj.link.atk, this.state.jsonObj.link.hp)}+加蛋數量</Typography></Grid>
                                                <Grid item xs><Typography>Race Bonus: {this.state.jsonObj.link.race_bouns}</Typography></Grid>
                                            </Grid>
                                            {this.state.jsonObj.link.lns && <Grid container spacing={24} style={{ ...theme.palette.green, ...{ margin: "0 -12px" } }}>
                                                <Grid item xs>
                                                    <Typography>Link Skill - {this.state.jsonObj.link.lns.name}</Typography>
                                                    <Typography>發動機率: {this.state.jsonObj.link.lns.min} ~ {this.state.jsonObj.link.lns.max}</Typography></Grid>
                                                <Grid item xs>
                                                    <Typography>{parseColorTag(this.state.jsonObj.link.lns.detail, false)}</Typography>
                                                    <Typography>{parseColorTag(this.state.jsonObj.link.lns.detailcn, false)}</Typography>
                                                </Grid>
                                            </Grid>}
                                            {!this.state.jsonObj.link.lns && <div style={theme.palette.green}>
                                                <Typography>Link Skill - 無</Typography>
                                            </div>}
                                            {this.state.jsonObj.link.lps && <Grid container spacing={24} style={{ ...theme.palette.orange, ...{ margin: "0 -12px" } }}>
                                                <Grid item xs><Typography>Link Passive - {this.state.jsonObj.link.lps.name}</Typography></Grid>
                                                <Grid item xs>
                                                    <Typography>{this.state.jsonObj.link.lps.detail}</Typography>
                                                    <Typography>{this.state.jsonObj.link.lps.detailcn}</Typography>
                                                </Grid>
                                            </Grid>}
                                            {!this.state.jsonObj.link.lps && <div style={theme.palette.orange}>
                                                <Typography>Link Passive - 無</Typography>
                                            </div>}
                                            <Grid container spacing={24}>
                                                <Grid item xs={2}><Typography>Link方法</Typography></Grid>
                                                <Grid item xs={10} className="inline">
                                                    {this.state.jsonObj.link.link_unit.map((unit, index) => <UnitIcon key={"link-unit-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                                    {this.state.jsonObj.link.link_unit && <Add style={styles.white} />}
                                                    <img src="/img/icon/money.png" style={{ width: "15px", height: "15px" }} />
                                                    <Typography>{this.state.jsonObj.link.link_money}</Typography>
                                                </Grid>
                                                <Grid item xs={2}><Typography>解Link方法</Typography></Grid>
                                                <Grid item xs={10} className="inline">
                                                    {this.state.jsonObj.link.del_link_unit && this.state.jsonObj.link.del_link_unit.map((unit, index) => <UnitIcon key={"del-link-unit-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                                    {this.state.jsonObj.link.del_link_unit && <Add style={styles.white} />}
                                                    <img src="/img/icon/money.png" style={{ width: "15px", height: "15px" }} />
                                                    <Typography>{this.state.jsonObj.link.del_link_money}</Typography>
                                                </Grid>
                                            </Grid>
                                        </>}
                                        {!this.state.jsonObj.link && <Typography>不適用</Typography>}
                                    </div>
                                    <Toolbar style={theme.palette.grey}>
                                        <Typography variant="headline">限界突破</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        {this.state.jsonObj.limit_over && <>
                                            <Grid container spacing={24}>
                                                <Grid item xs>
                                                    <Typography>可突破次數: {this.state.jsonObj.limit_over.max}</Typography>
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography>突破所需unit point: <img src="/img/icon/unit_point.png" style={{ width: "15px", height: "15px" }} alt="Unit Point" /> {this.state.jsonObj.limit_over.unitpoint}</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={24}>
                                                <Grid item xs className="inline">
                                                    <Typography>突破Bonus</Typography>
                                                    <TextField label="等級" type="number" margin="normal" min={1} max={this.state.jsonObj.limit_over.max}
                                                        value={this.state.limitOverLv}
                                                        onChange={this.handleChangeLimitOverLv}
                                                        InputLabelProps={{ shrink: true, }}
                                                    />
                                                </Grid>
                                                <Grid item xs><Typography>HP: HP x {getLimitOverValue(this.state.jsonObj.limit_over.limit_grow, this.state.jsonObj.limit_over.max, this.state.jsonObj.limit_over.max_hp, this.state.limitOverLv)}%</Typography></Grid>
                                                <Grid item xs><Typography>ATK: ATK x {getLimitOverValue(this.state.jsonObj.limit_over.limit_grow, this.state.jsonObj.limit_over.max, this.state.jsonObj.limit_over.max_atk, this.state.limitOverLv)}%</Typography></Grid>
                                                <Grid item xs><Typography>Cost: {Math.floor(getLimitOverValue(this.state.jsonObj.limit_over.limit_grow, this.state.jsonObj.limit_over.max, this.state.jsonObj.limit_over.max_cost, this.state.limitOverLv))}</Typography></Grid>
                                                <Grid item xs><Typography>Charm: {getLimitOverValue(this.state.jsonObj.limit_over.limit_grow, this.state.jsonObj.limit_over.max, this.state.jsonObj.limit_over.max_charm, this.state.limitOverLv, 'charm')}</Typography></Grid>
                                            </Grid>
                                        </>}
                                        {!this.state.jsonObj.limit_over && <Typography>不適用</Typography>}
                                    </div>
                                    <Toolbar style={theme.palette.grey}>
                                        <Typography variant="headline">使用此素材進化的Unit</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        {this.state.jsonObj.evos && this.state.jsonObj.evos.map((unit, index) => <UnitIcon key={"evo-material-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                        {!this.state.jsonObj.evos && <Typography>無</Typography>}
                                    </div>
                                    <Toolbar style={theme.palette.grey}>
                                        <Typography variant="headline">進化</Typography>
                                    </Toolbar>
                                    <div style={{ padding: "10px" }}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                <Typography>進化自</Typography>
                                                {this.state.jsonObj.evoFrom && <div className="inline">
                                                    <UnitIcon name={this.state.jsonObj.evoFrom.part_pre.name} draw_id={this.state.jsonObj.evoFrom.part_pre.draw_id} image={this.state.jsonObj.evoFrom.part_pre.image} />
                                                    <Add style={styles.white} />
                                                    {this.state.jsonObj.evoFrom.part.map((unit, index) => <UnitIcon key={"evo-from-material-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                                    <ArrowRight style={styles.white} />
                                                    <UnitIcon name={this.state.jsonObj.evoFrom.part_after.name} draw_id={this.state.jsonObj.evoFrom.part_after.draw_id} image={this.state.jsonObj.evoFrom.part_after.image} />
                                                </div>}
                                                {!this.state.jsonObj.evoFrom && <Typography>無</Typography>}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>可進化至</Typography>
                                                {this.state.jsonObj.evoTo && <Grid container spacing={24}>
                                                    <Grid item xs={12} className="inline">
                                                        <UnitIcon name={this.state.jsonObj.evoTo.part_pre.name} draw_id={this.state.jsonObj.evoTo.part_pre.draw_id} image={this.state.jsonObj.evoTo.part_pre.image} />
                                                        <Add style={styles.white} />
                                                        {this.state.jsonObj.evoTo.part.map((unit, index) => <UnitIcon key={"evo-from-material-" + index} name={unit.name} draw_id={unit.draw_id} image={unit.image} />)}
                                                        <ArrowRight style={styles.white} />
                                                        <UnitIcon name={this.state.jsonObj.evoTo.part_after.name} draw_id={this.state.jsonObj.evoTo.part_after.draw_id} image={this.state.jsonObj.evoTo.part_after.image} />
                                                    </Grid>
                                                    <Grid item xs={12} className="inline">
                                                        <Grid item xs><Typography>朋友等級: Lv.{this.state.jsonObj.evoTo.friend_level}或以上</Typography></Grid>
                                                        <Grid item xs><Typography>種族: {getKind(this.state.jsonObj.evoTo.friend_kind)}</Typography></Grid>
                                                        <Grid item xs><Typography>屬性: {getElement(this.state.jsonObj.evoTo.friend_elem)}</Typography></Grid>
                                                        <Grid item xs className="inline">
                                                            <Typography>進化關卡:</Typography>
                                                            <Typography component={Link} to={"/quest/" + this.state.jsonObj.evoTo.quest_id} style={{ color: "#bbb" }}>{this.state.jsonObj.evoTo.quest_name}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>}
                                                {!this.state.jsonObj.evoTo && <Typography>無</Typography>}
                                            </Grid>
                                        </Grid>
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>
                }
            })()}
        </Grid>
    }
}