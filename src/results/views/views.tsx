import "./views.css";

import { useCallback } from "react";
import { useLocation } from "wouter";

import type { DependencyAnalysis } from "../../dependency-tree";
import { GitHubIcon, PackageIcon, withViewTransition } from "../../shared";
import { useAppStore } from "../../store";

import { TabBar } from "../tab-bar";
import { ViewRoutes } from "../view-routes";

interface Props {
  dependencyAnalysis: DependencyAnalysis;
}

export const Views = ({ dependencyAnalysis }: Props) => {
  const reset = useAppStore((state) => state.reset);
  const [, navigate] = useLocation();

  const handleHomeClick = useCallback(() => {
    withViewTransition(() => {
      navigate("/");
    }, reset);
  }, [navigate, reset]);

  return (
    <div className="views-container">
      <div className="views-toolbar">
        <button
          className="views-icon-button"
          title="Back to home"
          onClick={handleHomeClick}
        >
          <PackageIcon size="25px" />
        </button>
        <TabBar />
        <a
          className="views-icon-button views-github-link"
          title="View project on GitHub"
          href="https://github.com/paccodes/pkgpeeker"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
      </div>
      <div className="views-content">
        <ViewRoutes dependencyAnalysis={dependencyAnalysis} />
      </div>
    </div>
  );
};
