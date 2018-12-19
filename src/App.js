import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Map from "./Map/Map";

const AppLayout = styled.div`
  width: 100vw;
  height: 100vh;
`;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Helmet>
          <title>Five O'Clock</title>
        </Helmet>
        <Map />
      </AppLayout>
    );
  }
}

export default App;
