import React from "react";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import Navbar from "./components/Navigation/Navbar";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[300]
        },
        secondary: {
            main: red[300]
        }
    }
})

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Navbar/>
      </ThemeProvider>
  );
}

export default App;
