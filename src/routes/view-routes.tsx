import { Route, Switch } from "wouter";

import { useTreeNavigatorState } from "../components";
import { useAppStore } from "../store";
import { DependencyTreeData } from "../types";
import {
  FileExplorerView,
  PackagesView,
  SecurityInsightsView,
  SizeAnalysisView,
} from "../views";

interface Props {
  dependencyTreeData: DependencyTreeData;
}

export const ViewRoutes = ({ dependencyTreeData }: Props) => {
  const webContainerInstance = useAppStore(
    (state) => state.webContainerInstance,
  );
  const treeNavigatorState = useTreeNavigatorState(dependencyTreeData);

  return (
    <Switch>
      <Route path="/*/files">
        <FileExplorerView
          dependencyTreeData={dependencyTreeData}
          webContainerInstance={webContainerInstance}
          treeNavigatorState={treeNavigatorState}
        />
      </Route>
      <Route path="/*/size">
        <SizeAnalysisView dependencyTreeData={dependencyTreeData} />
      </Route>
      <Route path="/*/security">
        <SecurityInsightsView />
      </Route>
      <Route path="/*">
        <PackagesView
          dependencyTreeData={dependencyTreeData}
          treeNavigatorState={treeNavigatorState}
        />
      </Route>
    </Switch>
  );
};
