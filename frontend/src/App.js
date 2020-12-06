import React from "react";
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from "react-router";
import Sections from "./components/Sections/Sections";
import Updates from "./components/Feed/Updates";
import UserProfile from "./components/profile/UserProfile";

function App() {

    return (
      <>
        <Navbar/>
        <Switch>
            <Route exact path='/sections' component={Sections}/>
            <Route exact path='/feed' component={Updates}/>
            <Route exact path='/profile' component={UserProfile}/>
        </Switch>
      </>
    );
}

export default App;
