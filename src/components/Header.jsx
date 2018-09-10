import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Header = () => (
    <AppBar>
        <Toolbar>
            <Typography variant="title" color="inherit">
                Divine Gate 資料庫
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/area">Area</Button>
            <Button color="inherit" component={Link} to="/mark">點心紙</Button>
            <Button color="inherit" component={Link} to="/quest">Quest</Button>
            <Button color="inherit" component={Link} to="/questlist">Quest List</Button>
            <Button color="inherit" component={Link} to="/skill">Skill</Button>
            <Button color="inherit" component={Link} to="/story">Story</Button>
            <Button color="inherit" component={Link} to="/unit">Unit</Button>
            <Button color="inherit" component={Link} to="/unitlist">Unit List</Button>
            <Button color="inherit" component={Link} to="/voteResult">Vote Result</Button>
        </Toolbar>
    </AppBar>
)

export default Header;