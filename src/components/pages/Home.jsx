import React from 'react';
import { Helmet } from "react-helmet";
import * as Constant from '../Constant';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemText } from '@material-ui/core';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <div>
            <Helmet>
                <title>{Constant.COMMON.SITE_NAME}</title>

                <meta property="og:title" content={Constant.COMMON.SITE_NAME} />
                <meta property="og:description" content={Constant.COMMON.SITE_NAME} />
                <meta property="og:site_name" content={Constant.COMMON.SITE_NAME} />
                <meta property="og:url" content={Constant.COMMON.HOST} />
            </Helmet>
            <Typography variant="title">Home</Typography>
            <List>
                <ListItem button component={Link}  to="/about">
                    <ListItemText primary="About"/>
                </ListItem>
                <ListItem button component={Link}  to="/area">
                    <ListItemText primary="Area"/>
                </ListItem>
                <ListItem button component={Link}  to="/mark">
                    <ListItemText primary="點心紙"/>
                </ListItem>
                <ListItem button component={Link}  to="/quest">
                    <ListItemText primary="Quest"/>
                </ListItem>
                <ListItem button component={Link}  to="/questlist">
                    <ListItemText primary="Quest List"/>
                </ListItem>
                <ListItem button component={Link}  to="/skill">
                    <ListItemText primary="Skill"/>
                </ListItem>
                <ListItem button component={Link}  to="/story">
                    <ListItemText primary="Story"/>
                </ListItem>
                <ListItem button component={Link}  to="/unit">
                    <ListItemText primary="Unit"/>
                </ListItem>
                <ListItem button component={Link}  to="/unitlist">
                    <ListItemText primary="Unit List"/>
                </ListItem>
                <ListItem button component={Link}  to="/voteResult">
                    <ListItemText primary="Vote Result"/>
                </ListItem>
            </List>
        </div>
    }
}