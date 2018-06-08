import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";

const App = () => (
  <div>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default App;
