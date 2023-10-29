import { AppState } from "../../types";
import { Spinner } from "./Spinner";
import "./StatusIndicator.css";

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
              return (
                <p>
                  Explore the packages and their dependencies
                  <br />
                  to navigate through the dependency tree.
                </p>
              );
            }
            default:
              return null;
          }
        })()}
      </>
    )}
  </div>
);
