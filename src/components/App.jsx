import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

import Header from './Header';
import * as Pages from './pages';

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Header />
        <main>
            <Switch>
                <Route exact strict path='/' component={Pages.Home} />
                <Route exact strict path='/about' component={Pages.About} />
                <Route exact strict path="/area/:id(\d+)" component={Pages.Area} />
                <Route exact strict path="/mark/:type(rare|collabo)" component={Pages.Mark} />
                <Route exact strict path="/quest/:id(\d+)" component={Pages.Quest} />
                <Route exact strict path="/questlist" component={Pages.QuestList} />
                <Route exact strict path="/rank" component={Pages.Rank} />
                <Route exact strict path="/skill/:type(ls|ns|ps|lns|lps)" component={Pages.Skill} />
                <Route exact strict path="/story" component={Pages.Story} />
                <Route exact strict path="/unit/:id(\d+)" component={Pages.Unit} />
                <Route exact strict path="/unitlist" component={Pages.UnitList} />
                <Route exact strict path="/voteResult" component={Pages.voteResult} />
                <Route component={Pages.Error} />
            </Switch>
        </main>
    </MuiThemeProvider>
)

export default App;