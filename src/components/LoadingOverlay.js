import React from "react";
import ReactLoadingOverlay from "react-loading-overlay";

const LoadingOverlay = ({ isLoading }) => {
  if (isLoading) {
    return (
      <ReactLoadingOverlay active={true} spinner text="Loading your content...">
        <div style={{ height: "100vh", width: "100vw", background: "green" }} />
      </ReactLoadingOverlay>
    );
  }

  return null;
};

export default LoadingOverlay;
