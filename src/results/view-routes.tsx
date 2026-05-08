import { Route, Switch } from "wouter";

import type { DependencyAnalysis } from "../dependency-tree";
import { FileExplorerView } from "../file-explorer";
import { PackagesView } from "../packages";
import { InstallAuditView } from "../install-audit";
import { useTreeNavigatorState } from "../tree-navigator";
import { SizeAnalysisView } from "../size-analysis";
import { useAppStore } from "../store";

interface Props {
  dependencyAnalysis: DependencyAnalysis;
}

export const ViewRoutes = ({ dependencyAnalysis }: Props) => {
  const webContainerInstance = useAppStore(
    (state) => state.webContainerInstance,
  );
  const treeNavigatorState = useTreeNavigatorState(dependencyAnalysis);

  return (
    <Switch>
      <Route path="/*/files">
        <FileExplorerView
          dependencyAnalysis={dependencyAnalysis}
          webContainerInstance={webContainerInstance}
          treeNavigatorState={treeNavigatorState}
        />
      </Route>
      <Route path="/*/size">
        <SizeAnalysisView dependencyAnalysis={dependencyAnalysis} />
      </Route>
      <Route path="/*/audit">
        <InstallAuditView dependencyAnalysis={dependencyAnalysis} />
      </Route>
      <Route path="/*">
        <PackagesView
          dependencyAnalysis={dependencyAnalysis}
          treeNavigatorState={treeNavigatorState}
        />
      </Route>
    </Switch>
  );
};
