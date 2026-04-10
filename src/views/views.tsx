import { WebContainer } from "@webcontainer/api";
import { Route, Switch } from "wouter";

import { TabBar, useTreeNavigatorState } from "../components";
import { DependencyTreeData } from "../types";

import { FileExplorerView } from "./file-explorer";
import { PackagesView } from "./packages";
import { SecurityInsightsView } from "./security-insights";

interface Props {
  ref: React.RefObject<HTMLDivElement | null>;
  dependencyTreeData: DependencyTreeData;
  webContainerInstance: WebContainer | null;
}

export const Views = ({
  ref,
  dependencyTreeData,
  webContainerInstance,
}: Props) => {
  const treeNavigatorState = useTreeNavigatorState(dependencyTreeData);

  return (
    <div className="views-container" ref={ref}>
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
