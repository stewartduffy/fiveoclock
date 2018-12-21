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
    isLoading: true,
    mapStyle: defaultMapStyle,
    locationsResponse: null,
    selectedLocation: null,
    selectedLocationFeaturePoint: null,
    selectedLocationFeaturePolygon: null,
    selectedLocationFeatureCoordinates: null,

    viewport: {
      latitude: 40,
      longitude: -100,
      zoom: 3,
      bearing: 0,
      pitch: 0
    }
  };

  async componentDidMount() {
    try {
      const locationsResponse = await getLocations();
      const selectedLocation = get(locationsResponse, "geoJson");
      const selectedLocationFeaturePoint = get(selectedLocation, "features[0]");
      const selectedLocationFeaturePolygon = get(
        selectedLocation,
        "features[1]"
      );
      const selectedLocationFeatureCoordinates = getCoord(
        selectedLocationFeaturePoint
      );

      this.setState({
        isLoading: false,
        locationsResponse,
        selectedLocation,
        selectedLocationFeaturePoint,
        selectedLocationFeaturePolygon,
        selectedLocationFeatureCoordinates
      });

      // this._loadData(selectedLocation);
      this._setViewPort(selectedLocationFeaturePolygon);
    } catch (e) {
      console.log("e: ", e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("prevState: ", prevState);
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

  _setViewPort = selectedLocationFeaturePolygon => {
    if (selectedLocationFeaturePolygon) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(
        selectedLocationFeaturePolygon
      );

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

  _renderCityMarker = () => {
    const { selectedLocationFeatureCoordinates } = this.state;

    if (selectedLocationFeatureCoordinates) {
      return (
        <Marker
          longitude={selectedLocationFeatureCoordinates[0]}
          latitude={selectedLocationFeatureCoordinates[1]}
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
        <InfoPanel selectedLocation={this.state.selectedLocation} />
      </React.Fragment>
    );
  }
}

export default Map;
