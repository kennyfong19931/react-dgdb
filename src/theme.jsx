import { createMuiTheme } from '@material-ui/core/styles';
import { red, orange, green, yellow, blue, indigo, purple, pink, teal } from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#4c1256',
            backgroundColor: '#4c1256'
        },
        secondary: {
            main: '#ffd54f'
        },
        red: {
            backgroundColor: red[500]
        },
        orange: {
            backgroundColor: orange[500]
        },
        green: {
            backgroundColor: green[500]
        },
        yellow: {
            color: '#000',
            backgroundColor: yellow[500]
        },
        blue: {
            backgroundColor: blue[500]
        },
        indigo: {
            backgroundColor: indigo[500]
        },
        purple: {
            backgroundColor: purple[500]
        },
        white: {
            color: '#000',
            backgroundColor: "#fff"
        },
        pink: {
            backgroundColor: pink[300]
        },
        info: {
            color: blue[800],
            backgroundColor: blue[100]
        },
        danger: {
            color: red[800],
            backgroundColor: red[100]
        },
        breadcrumb:{
            color: "rgba(255,255,255,0.7)"
        },
        breadcrumbLast:{
            color: "#fff"
        }
    },
    overrides: {
        MuiChip: {
            root: {
                minWidth: "65px",
                margin: "2px"
            }
        },
        MuiCard:{
            root:{
                backgroundColor: "#42424280"
            }
        },
        MuiButton:{
            contained: {
                color: "#fff",
                backgroundColor: teal[400]
            }
        },
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '"Noto Sans TC"', 
            'sans-serif',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
        ].join(','),
    },
});