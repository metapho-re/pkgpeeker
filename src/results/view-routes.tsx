import { Route, Switch } from "wouter";

import type { DependencyTreeData } from "../dependency-tree";
import { FileExplorerView } from "../file-explorer";
import { PackagesView } from "../packages";
import { SecurityInsightsView } from "../security-insights";
import { useTreeNavigatorState } from "../tree-navigator";
import { SizeAnalysisView } from "../size-analysis";
import { useAppStore } from "../store";

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
