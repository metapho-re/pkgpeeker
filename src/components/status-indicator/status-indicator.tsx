import "./status-indicator.css";

import type { AppState } from "../../types";

import { Spinner } from "./spinner";

interface Props {
  appState: AppState;
  hasError: boolean;
}

export const StatusIndicator = ({ appState, hasError }: Props) => (
  <div className="app-state">
    {hasError ? (
      <p className="error-message">Sorry! Something wrong happened...</p>
    ) : (
      <>
        {(function () {
          switch (appState) {
            case "booting": {
              return <Spinner message="Booting web container..." />;
            }
            case "installing": {
              return (
                <Spinner message="Installing packages in the browser..." />
              );
            }
            case "crunching": {
              return <Spinner message="Crunching installation data..." />;
            }
            case "done": {
              return null;
            }
            default:
              return null;
          }
        })()}
      </>
    )}
  </div>
);
