import React from "react";
import styled from "styled-components";
import ReactLoadingOverlay from "react-loading-overlay";

const StyledInfoPanel = styled.div`
  position: absolute;
  left: 0px;
  width: 100%;
  height: 50%;

  display: flex;
  flex-direction: column;
  bottom: 0;

  @media screen and (min-width: 750px) {
    width: 350px;
    height: 100vh;
    top: 0px;
  }
`;

const StyledInfoPanelContent = styled.div`
  overflow-y: scroll;
  background: rgba(255, 255, 255, 0.93);
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 12px;
  height: 100%;

  @media screen and (min-width: 750px) {
    height: auto;
  }
`;

const InfoPanel = ({ locations }) => {
  return (
    <StyledInfoPanel>
      <StyledInfoPanelContent>
        <ReactLoadingOverlay active={!locations} spinner text="Loading...">
          {locations && (
            <React.Fragment>
              <h1>{locations.placeData.name}</h1>
              <h2>{locations.placeData.cleanTime}</h2>
            </React.Fragment>
          )}
        </ReactLoadingOverlay>
      </StyledInfoPanelContent>
    </StyledInfoPanel>
  );
};

export default InfoPanel;
