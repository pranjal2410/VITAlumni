import React from "react";
import Navbar from "./components/Navigation/Navbar";
import {Route, Switch} from "react-router";
import Sections from "./components/Sections/Sections";

function App() {
    return (
      <>
        <Navbar/>
        <Switch>
            <Route exact path='/sections' component={Sections}/>
        </Switch>
      </>
    );
}

export default App;
