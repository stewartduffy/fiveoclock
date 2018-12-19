import React, { Component } from "react";
import MapGL from "react-map-gl";
import styled from "styled-components";

const MapWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 50vh;
  background: #eeeeee;

  @media screen and (min-width: 750px) {
    height: 100%;
  }
`;

class MapLayout extends Component {
  render() {
    const { viewport, mapStyle, _onViewportChange, _onClick } = this.props;

    return (
      <MapWrapper>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapStyle}
          onViewportChange={_onViewportChange}
          onClick={_onClick}
        />
      </MapWrapper>
    );
  }
}

export default MapLayout;
