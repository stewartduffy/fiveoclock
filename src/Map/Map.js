import React, { Component } from "react";
import MapGL, { LinearInterpolator } from "react-map-gl";
import get from "lodash/get";
import axios from "axios";
import WebMercatorViewport from "viewport-mercator-project";
import bbox from "@turf/bbox";
import LoadingOverlay from "../components/LoadingOverlay";
import { defaultMapStyle, dataLayer } from "./map-style.js";
import { fromJS } from "immutable";

async function getLocations() {
  const url = process.env.REACT_APP_API_URL;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

class Map extends Component {
  state = {
    isLoading: true,
    mapStyle: defaultMapStyle,
    year: 2015,
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 40,
      longitude: -100,
      zoom: 3,
      bearing: 0,
      pitch: 0
    }
  };

  async componentDidMount() {
    const locations = await getLocations();
    this.setState({ isLoading: false });
    this._loadData(locations);
    this._setViewPort(locations);
  }

  _onClick = event => {
    const feature = event.features[0];
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport);

      const { longitude, latitude, zoom } = viewport.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 40 }
      );

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new LinearInterpolator({
            around: [event.offsetCenter.x, event.offsetCenter.y]
          }),
          transitionDuration: 1000
        }
      });
    }
  };

  _setViewPort = locations => {
    const feature = get(locations, "features[1]");

    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport);

      const { longitude, latitude, zoom } = viewport.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 40 }
      );

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          // transitionInterpolator: new LinearInterpolator({
          //   around: [feature.offsetCenter.x, feature.offsetCenter.y]
          // }),
          transitionDuration: 1000
        }
      });
    }
  };

  _loadData = data => {
    // updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(["sources", "incomeByState"], fromJS({ type: "geojson", data }))
      // Add point layer to map
      .set("layers", defaultMapStyle.get("layers").push(dataLayer));

    this.setState({ data, mapStyle });
  };

  _onViewportChange = viewport => this.setState({ viewport });

  render() {
    const { viewport, mapStyle } = this.state;

    return (
      <div style={{ height: "100%" }}>
        <LoadingOverlay isLoading={this.state.isLoading} />

        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          onClick={this._onClick}
        />
      </div>
    );
  }
}

export default Map;
