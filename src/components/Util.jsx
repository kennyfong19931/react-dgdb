import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Tooltip from '@material-ui/core/Tooltip';
// import Typography from '@material-ui/core/Typography';

export function parseColorTag(input, isRemove) {
    const regex = /\[([A-Fa-f0-9]{6}|w{3})\](.+?)\[\-\]/gm; // eslint-disable-line no-useless-escape
    if (isRemove) {
        if (regex.exec(input) !== null) {
            input = input.replace(regex, '$2');
            // remove extra [-]
            input = input.replace(/\[\-\]/g, ''); // eslint-disable-line no-useless-escape
        } else {
            // remove extra [-]
            input = input.replace(/\[\-\]/g, ''); // eslint-disable-line no-useless-escape
        }
        return input;
    } else {
        let m;
        let output = [];
        let inputArr = input.split(/(\[(?:[A-Fa-f0-9]{6}|w{3})\](?:.)\[\-\])/gm); // eslint-disable-line no-useless-escape
        inputArr.map((value, index) => {
            if ((m = regex.exec(value)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                output.push(<span key={"parse-color-" + index} variant="inherit" style={{ color: "#" + m[1] }}>{m[2]}</span>);
            } else {
                // remove extra [-]
                output.push(<span key={"parse-color-" + index} variant="inherit">{value.replace(/\[\-\]/g, '')}</span>); // eslint-disable-line no-useless-escape
            }
        });
        return output;
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
    }

    static defaultProps = {
        name: '',
        draw_id: 0,
        image: '',
        size: 40
    }

    render() {
        return <Tooltip title={this.props.draw_id + " - " + this.props.name}>
            <Link to={"/unit/" + this.props.draw_id}><img src={this.props.image} alt={this.props.draw_id + " - " + this.props.name} style={{ height: this.props.size + "px", width: this.props.size + "px" }} /></Link>
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