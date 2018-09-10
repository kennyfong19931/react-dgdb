import { createMuiTheme } from '@material-ui/core/styles';
import { red, orange, green, yellow, blue, indigo, purple } from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#4c1256'
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
        info: {
            color: blue[800],
            backgroundColor: blue[100]
        },
    },
    overrides: {
        MuiChip: {
            root: {
                minWidth: "65px"
            }
        }
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