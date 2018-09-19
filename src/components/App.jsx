import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Header from './Header';
import * as Pages from './pages';

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Header />
        <CssBaseline />
        <main className="container">
            <Switch>
                <Route exact strict path='/' component={Pages.Home} />
                <Route exact strict path='/about' component={Pages.About} />
                <Route exact strict path="/area/:id(\d+)" component={Pages.Area} />
                <Route exact strict path="/mark/:type(rare|collabo)" component={Pages.Mark} />
                <Route exact strict path="/quest/:id(\d+)" component={Pages.Quest} />
                <Route exact strict path="/questlist" component={Pages.QuestList} />
                <Route exact strict path="/skill/:type(l|n|p|ln|lp)" component={Pages.Skill} />
                <Route exact strict path="/story" component={Pages.Story} />
                <Route exact strict path="/unit/:id(\d+)" component={Pages.Unit} />
                <Route exact strict path="/unitlist/:series?" component={Pages.UnitList} />
                <Route exact strict path="/voteResult" component={Pages.VoteResult} />
                <Route component={Pages.ErrorPage} />
            </Switch>
        </main>
        <footer>
            <AppBar position="static">
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }}>Graphics © Copyright by Gungho Online Entertainment,Inc.</Typography>
                    <IconButton component="a" href="https://github.com/kennyfong19931/react-dgdb" target="_blank">
                        <SvgIcon viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                        </SvgIcon>
                    </IconButton >
                </Toolbar>
            </AppBar>
        </footer>
    </MuiThemeProvider>
)

export default App;