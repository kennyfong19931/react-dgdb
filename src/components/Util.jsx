import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import Tooltip from '@material-ui/core/Tooltip';

export function parseColorTag(input, isRemove = false) {
    if (input == undefined || input == '') return '';
    console.log(input);
    const colorRegex = /\[([A-Fa-f0-9]{6}|w{3})\](.+?)\[\-\]/gm; // eslint-disable-line no-useless-escape
    const colorRegex2 = /(\[(?:[A-Fa-f0-9]{6}|w{3})\](?:.+?)\[\-\])/gm; // eslint-disable-line no-useless-escape
    const colorEndTagRegex = /\[\-\]/g; // eslint-disable-line no-useless-escape
    const imgRegex = /<img src="http:\/\/img\.qov\.tw(.+?)" alt="(.+?)"\/>/gm;
    const imgRegex2 = /(<img src="(?:.+?)" alt="(?:.+?)"\/>)/gm;
    let m;
    let output = [];

    // handle img tag
    let inputArr = [input];
    if (imgRegex2.exec(input) !== null) {
        inputArr = input.split(imgRegex2);
    }
    inputArr.map((value, index) => {
        if ((m = imgRegex.exec(value)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === imgRegex.lastIndex) {
                imgRegex.lastIndex++;
            }

            output.push(<img key={"parse-color-" + index} src={"/img" + m[1]} alt={m[2]} />);
        } else {
            if (isRemove) {
                if (colorRegex.exec(value) !== null) {
                    value = value.replace(colorRegex, '$2');
                }
                // remove extra [-]
                value = value.replace(colorEndTagRegex, '');
                output.push(value);
            } else {
                if (colorRegex2.exec(value) !== null) {
                    value.split(colorRegex2).map((value, index2) => {
                        if ((m = colorRegex.exec(value)) !== null) {
                            // This is necessary to avoid infinite loops with zero-width matches
                            if (m.index === colorRegex.lastIndex) {
                                colorRegex.lastIndex++;
                            }

                            output.push(<span key={"parse-color-" + index + "-" + index2} variant="inherit" style={{ color: "#" + m[1] }}>{m[2]}</span>);
                        } else if (colorEndTagRegex.exec(value) !== null) {
                            // remove extra [-]
                            output.push(<span key={"parse-color-" + index + "-" + index2} variant="inherit">{value.replace(colorEndTagRegex, '')}</span>);
                        } else {
                            output.push(<span key={"parse-color-" + index + "-" + index2} variant="inherit">{value}</span>);
                        }
                    });
                } else {
                    output.push(<span key={"parse-color-" + index} variant="inherit">{value}</span>);
                }
            }
        }
    });
    console.log(output);
    if (isRemove) {
        return output.join('');
    } else {
        return output;
    }
}

export function json_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(str))));
}
export function b64_to_json(str) {
    return JSON.parse(decodeURIComponent(escape(window.atob(str))));
}

export function getElement(type, key) {
    switch (type) {
        case 1:
            return <img key={key} src="/img/icon/none.jpg" style={{ height: "25px", width: "25px" }} alt="無"></img>;
        case 2:
            return <img key={key} src="/img/icon/fire.jpg" style={{ height: "25px", width: "25px" }} alt="炎"></img>;
        case 3:
            return <img key={key} src="/img/icon/water.jpg" style={{ height: "25px", width: "25px" }} alt="水"></img>;
        case 4:
            return <img key={key} src="/img/icon/light.jpg" style={{ height: "25px", width: "25px" }} alt="光"></img>;
        case 5:
            return <img key={key} src="/img/icon/dark.jpg" style={{ height: "25px", width: "25px" }} alt="暗"></img>;
        case 6:
            return <img key={key} src="/img/icon/wind.jpg" style={{ height: "25px", width: "25px" }} alt="風"></img>;
        case 7:
            return <img key={key} src="/img/icon/life.jpg" style={{ height: "25px", width: "25px" }} alt="心"></img>;
    }
}

export class UnitIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        draw_id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        size: PropTypes.number,
        lazy: PropTypes.bool,
    }

    static defaultProps = {
        name: '',
        draw_id: 0,
        image: '',
        size: 40,
        lazy: false,
    }

    render() {
        return <Tooltip title={this.props.draw_id + " - " + this.props.name}>
            <Link to={"/unit/" + this.props.draw_id}>
                {this.props.lazy && <LazyLoad height={this.props.size} placeholder={<img src="/img/empty.png" style={{ height: this.props.size + "px", width: this.props.size + "px" }} />}>
                    <img src={this.props.image} alt={this.props.draw_id + " - " + this.props.name} style={{ height: this.props.size + "px", width: this.props.size + "px" }} />
                </LazyLoad>}
                {!this.props.lazy && <img src={this.props.image} alt={this.props.draw_id + " - " + this.props.name} style={{ height: this.props.size + "px", width: this.props.size + "px" }} />}
            </Link>
        </Tooltip>
    }
}

export class TrapIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        effective_type: PropTypes.number.isRequired,
        effective_value: PropTypes.number.isRequired,
        size: PropTypes.number,
    }

    static defaultProps = {
        name: '',
        effective_type: 0,
        effective_value: 0,
        size: 40
    }

    render() {
        let title = '';
        let image = '/img/empty.png';
        switch (this.props.effective_type) {
            case 1: //tiger
            case 2:
                title = this.props.name + ' - 扣減' + this.props.effective_value + 'HP';
                image = '/img/trap/trap_tiger.png';
                break;
            case 3: //mine
            case 4:
                title = this.props.name + ' - 移動至附近一格, 並扣減' + this.props.effective_value + 'HP';
                image = '/img/trap/trap_mine.png';
                break;
            case 5: //pitfall
                title = this.props.name + ' - 扣減' + this.props.effective_value + 'HP';
                image = '/img/trap/trap_pitfall.png';
                break;
            case 7: //落石による移動不可
                title = this.props.name + ' - 扣減' + this.props.effective_value + 'HP';
                image = '/img/trap/trap_pitfall.png';
                break;
            case 11: //hungey
                title = this.props.name + ' - 扣減' + this.props.effective_value + 'SP';
                image = '/img/trap/trap_hungry.png';
                break;
            case 15: //lostmoney
                title = this.props.name + ' - 扣減' + this.props.effective_value + '%金錢';
                image = '/img/trap/trap_lostmoney.png';
                break;
            case 17: //block
                title = this.props.name + ' - 倒退一步';
                image = '/img/trap/trap_block.png';
                break;
            case 18: //telepot
                title = this.props.name + ' - 傳送到隨機位置';
                image = '/img/trap/trap_telepot.png';
                break;
            case 19: //restart
                title = this.props.name + ' - 傳送到起點';
                image = '/img/trap/trap_restart.png';
                break;
            case 20: //dark
                title = this.props.name + ' - ' + this.props.effective_value + '步內, 不能看見旁邊格子的種類';
                image = '/img/trap/trap_dark.png';
                break;
            case 21: //poison
                title = this.props.name + ' - 每走一步扣減' + this.props.effective_value + '%HP';
                image = '/img/trap/trap_poison.png';
                break;
            default:
                break;
        }
        return <Tooltip title={title}>
            <img src={image} alt={title} style={{ height: this.props.size + "px", width: this.props.size + "px" }} />
        </Tooltip>
    }
}