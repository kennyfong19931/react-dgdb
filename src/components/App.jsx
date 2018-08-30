import React from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Header />
        <Main />
    </MuiThemeProvider>
)

export default App;