import { Route, Switch } from "wouter";

import { LandingPage, ResultsPage } from "../pages";

export const Routes = () => (
  <Switch>
    <Route path="/">
      <LandingPage />
    </Route>
    <Route path="/*">
      <ResultsPage />
    </Route>
  </Switch>
);
