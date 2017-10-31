import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { Contact, Home, NoMatch } from "./Pages";
import Footer from "./Static/Footer";
import Navbar from "./Static/Navbar";

class App extends Component {
  render() {
    const siteContainerStyle = {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column"
    };
    const siteContentStyle = { flex: "1" };
    return (
      <div style={siteContainerStyle}>
        <Navbar />
        <div style={siteContentStyle}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/contact" component={Contact} />
            <Route component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
