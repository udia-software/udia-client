import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Footer from "./Static/Footer";
import Navbar from "./Shared/Navbar";
import AllNodes from "./Pages/AllNodes";
import Contact from "./Pages/Contact";
import CreateNode from "./Pages/CreateNode";
import Home from "./Pages/Home";
import NoMatch from "./Pages/NoMatch";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Lesson from "./Pages/Lesson";

class App extends Component {
  render() {
    const siteContainerStyle = {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column"
    };
    const siteContentStyle = {
      flex: "1",
      display: "flex",
      alignItems: "center"
    };
    return (
      <div style={siteContainerStyle}>
        <Navbar />
        <div style={siteContentStyle}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/lesson" component={Lesson} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/all" component={AllNodes} />
            <Route exact path="/create" component={CreateNode} />
            <Route component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
