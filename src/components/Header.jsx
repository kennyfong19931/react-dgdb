import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

class Header extends React.Component {
    state = {
        anchorEl: null,
        open: false,
    };

    toggleDrawer = (open) => () => {
        this.setState({
            open: open,
        });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        return <>
            <AppBar>
                <Toolbar style={{ alignItems: "center", justifyContent: "center" }}>
                    <Hidden mdUp>
                        <IconButton
                            color="inherit"
                            aria-label="Open Menu"
                            onClick={this.toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography variant="title" color="inherit" component={Link} to="/">
                        Divine Gate 資料庫
                    </Typography>
                    <Hidden smDown>
                        <Button color="inherit" component={Link} to="/unitlist">Unit列表</Button>
                        <Button color="inherit" component={Link} to="/questlist">地下城列表</Button>
                        <Button color="inherit" aria-owns={this.state.anchorEl ? 'skill-menu' : null} aria-haspopup="true" onClick={this.handleClick}>技能列表</Button>
                        <Menu id="skill-menu"
                            anchorEl={this.state.anchorEl}
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem component={Link} to="/skill/l" onClick={this.handleClose}>隊長技能 Leader Skill</MenuItem>
                            <MenuItem component={Link} to="/skill/a" onClick={this.handleClose}>主動技能 Active Skill</MenuItem>
                            <MenuItem component={Link} to="/skill/n" onClick={this.handleClose}>普通技能 Normal Skill</MenuItem>
                            <MenuItem component={Link} to="/skill/p" onClick={this.handleClose}>被動技能 Passive Skill</MenuItem>
                            <MenuItem component={Link} to="/skill/ln" onClick={this.handleClose}>Link技能 Link Skill</MenuItem>
                            <MenuItem component={Link} to="/skill/lp" onClick={this.handleClose}>Link被動技能 Link Passive</MenuItem>
                        </Menu>
                        <Button color="inherit" component={Link} to="/story">故事列表</Button>
                        <Button color="inherit" component={Link} to="/mark/rare">點心紙</Button>
                        <Button color="inherit" component={Link} to="/voteResult">人氣投票結果</Button>
                    </Hidden>
                </Toolbar>
            </AppBar>
            <Drawer open={this.state.open} onClose={this.toggleDrawer(false)} anchor="left">
                <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer(false)}
                    onKeyDown={this.toggleDrawer(false)}
                >
                    <div>
                        <IconButton onClick={this.toggleDrawer(false)}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem component={Link} to="/unitlist">
                            <ListItemText primary="Unit列表" />
                        </ListItem>
                        <ListItem component={Link} to="/questlist">
                            <ListItemText primary="地下城列表" />
                        </ListItem>
                        <ListItem component={Link} to="/story">
                            <ListItemText primary="故事列表" />
                        </ListItem>
                        <ListItem component={Link} to="/mark/rare">
                            <ListItemText primary="點心紙" />
                        </ListItem>
                        <ListItem component={Link} to="/voteResult">
                            <ListItemText primary="人氣投票結果" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem component={Link} to="/skill/l">
                            <ListItemText primary="隊長技能" secondary="Leader Skill" />
                        </ListItem>
                        <ListItem component={Link} to="/skill/a">
                            <ListItemText primary="主動技能" secondary="Active Skill" />
                        </ListItem>
                        <ListItem component={Link} to="/skill/n">
                            <ListItemText primary="普通技能" secondary="Normal Skill" />
                        </ListItem>
                        <ListItem component={Link} to="/skill/p">
                            <ListItemText primary="被動技能" secondary="Passive Skill" />
                        </ListItem>
                        <ListItem component={Link} to="/skill/ln">
                            <ListItemText primary="Link技能" secondary="Link Skill" />
                        </ListItem>
                        <ListItem component={Link} to="/skill/lp">
                            <ListItemText primary="Link被動技能" secondary="Link Passive" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    }
}

export default Header;