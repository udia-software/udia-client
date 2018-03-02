import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import logo from '../logo.svg';
import './App.css';
import { Home } from "./Pages";

class App extends Component {
  render() {
    const siteContainerStyle = {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      backgroundColor: "#000",
      color: "#fff"
    };
    const siteContentStyle = {
      flex: "1",
      display: "flex",
      alignItems: "center"
    };
    return (
      <div style={siteContainerStyle} className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
