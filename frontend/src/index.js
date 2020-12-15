import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {blue, red} from "@material-ui/core/colors";
import {SnackbarProvider} from "notistack";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[300]
        },
        secondary: {
            main: red[300]
        },
    },
})

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <CssBaseline/>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SnackbarProvider>
    </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
