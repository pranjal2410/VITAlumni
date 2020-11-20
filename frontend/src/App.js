import React from "react";
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from "react-router";
import Sections from "./components/Sections/Sections";
import Updates from "./components/Feed/Updates";

function App() {

    return (
      <>
        <Navbar/>
        <Switch>
            <Route exact path='/sections' component={Sections}/>
            <Route exact path='/feed' component={Updates}/>
        </Switch>
      </>
    );
}

export default App;
