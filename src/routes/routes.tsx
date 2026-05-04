import { Route, Switch } from "wouter";

import { LandingPage } from "../landing";
import { ResultsPage } from "../results";

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
