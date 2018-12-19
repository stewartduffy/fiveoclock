import React, { Component } from "react";
import { LinearInterpolator, Marker } from "react-map-gl";
import get from "lodash/get";
import WebMercatorViewport from "viewport-mercator-project";
import bbox from "@turf/bbox";
import { getCoord } from "@turf/invariant";
import InfoPanel from "../components/InfoPanel";
import { defaultMapStyle, dataLayer } from "./map-style.js";
import { fromJS } from "immutable";
import MapLayout from "./MapLayout";
import getLocations from "../api/getLocations";
import CityPin from "./city-pin";

class Map extends Component {
  state = {
    locations: null,
    isLoading: true,
    mapStyle: defaultMapStyle,
    year: 2015,
    data: null,
    hoveredFeature: null,
    markerCoordinates: null,
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
    const markerFeature = get(locations, "features[0]");
    const markerCoordinates = getCoord(markerFeature);
    this.setState({ locations, isLoading: false, markerCoordinates });
    // this._loadData(locations);
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

      console.log("_setViewPort: ");

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

  _renderCityMarker = () => {
    const { markerCoordinates } = this.state;

    if (markerCoordinates) {
      return (
        <Marker
          longitude={markerCoordinates[0]}
          latitude={markerCoordinates[1]}
        >
          <CityPin size={50} />
        </Marker>
      );
    }
  };

  render() {
    const { viewport, mapStyle } = this.state;

    return (
      <React.Fragment>
        <MapLayout
          viewport={viewport}
          mapStyle={mapStyle}
          _onViewportChange={this._onViewportChange}
          _onClick={this._onClick}
        >
          {this._renderCityMarker()}
        </MapLayout>
        <InfoPanel locations={this.state.locations} />
      </React.Fragment>
    );
  }
}

export default Map;
