import React from "react";
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from "react-router";
import Sections from "./components/Sections/Sections";
import Updates from "./components/Feed/Updates";
import UserProfile from "./components/profile/UserProfile";
import Search from "./components/search/Search";
import PersonProfile from "./components/profile/PersonProfile";
import About from "./components/about/About";
import Home from "./components/home/Home";
import {createMuiTheme, ThemeProvider, CssBaseline} from "@material-ui/core";
import {blue, red} from "@material-ui/core/colors";
import {ThemeContext} from "./context/ThemeContext";

function App() {
    const {dark} = React.useContext(ThemeContext);

    const theme = createMuiTheme({
        palette: {
            type: dark?'dark':'light',
            primary: {
                main: dark?blue[300]:blue[800],
            },
            secondary: {
                main: dark?red[300]:red[800],
            },
        },
    })

    return (
      <>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Navbar/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/sections' component={Sections}/>
                <Route exact path='/about' component={About}/>
                <Route exact path='/feed' component={Updates}/>
                <Route exact path='/profile' component={UserProfile}/>
                <Route exact path='/search' component={Search}/>
                <Route exact path='/person/:slug' component={PersonProfile}/>
            </Switch>
        </ThemeProvider>
      </>
    );
}

export default App;
