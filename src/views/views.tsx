import { Route, Switch } from "wouter";

import { TabBar, useTreeNavigatorState } from "../components";
import { useAppStore } from "../store";
import { DependencyTreeData } from "../types";

import { FileExplorerView } from "./file-explorer";
import { PackagesView } from "./packages";
import { SecurityInsightsView } from "./security-insights";

interface Props {
  dependencyTreeData: DependencyTreeData;
}

export const Views = ({ dependencyTreeData }: Props) => {
  const webContainerInstance = useAppStore(
    (state) => state.webContainerInstance,
  );
  const treeNavigatorState = useTreeNavigatorState(dependencyTreeData);

  return (
    <div className="views-container">
      <TabBar />
      <Switch>
        <Route path="/*/files">
          <FileExplorerView
            dependencyTreeData={dependencyTreeData}
            webContainerInstance={webContainerInstance}
            treeNavigatorState={treeNavigatorState}
          />
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
    </div>
  );
};
