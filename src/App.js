import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PremiumContent from "./pages/PremiumContent";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import React, { useState, useEffect } from "react";
import {
  getUser,
  getToken,
  setUserSession,
  resetUserSession,
} from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIURL =
  "https://5ot0pai2e3.execute-api.us-east-1.amazonaws.com/prod/verify";

function App() {
  const [isAuthenicating, setAuthenicating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (
      token === "undefined" ||
      token === undefined ||
      token === null ||
      !token
    ) {
      return;
    }

    const requestConfig = {
      headers: {
        "x-api-key": "Ysdf4CZWX94Pby6pCoKdc3vWOFIqbqSG43MjHMou",
      },
    };
    const requestBody = {
      user: getUser(),
      token: token,
    };

    axios
      .post(verifyTokenAPIURL, requestBody, requestConfig)
      .then((response) => {
        setUserSession(response.data.user, response.data.token);
        setAuthenicating(false);
      })
      .catch(() => {
        resetUserSession();
        setAuthenicating(false);
      });
  }, []);

  const token = getToken();
  if (isAuthenicating && token) {
    return <div className="content">Authenicating...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
          <NavLink activeClassName="active" to="/register">
            Register
          </NavLink>
          <NavLink activeClassName="active" to="/login">
            Login
          </NavLink>
          <NavLink activeClassName="active" to="/premium-content">
            Premium Content
          </NavLink>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <PublicRoute path="/register" component={Register} />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/premium-content" component={PremiumContent} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
