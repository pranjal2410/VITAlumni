import React from "react";
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from "react-router";
import Sections from "./components/Sections/Sections";
import Updates from "./components/Feed/Updates";
import UserProfile from "./components/profile/UserProfile";
import Search from "./components/search/Search";
import PersonProfile from "./components/profile/PersonProfile";

function App() {

    return (
      <>
        <Navbar/>
        <Switch>
            <Route exact path='/sections' component={Sections}/>
            <Route exact path='/feed' component={Updates}/>
            <Route exact path='/profile' component={UserProfile}/>
            <Route exact path='/search' component={Search}/>
            <Route exact path='/person/:slug' component={PersonProfile}/>
        </Switch>
      </>
    );
}

export default App;
