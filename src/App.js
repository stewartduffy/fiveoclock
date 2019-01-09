import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Map from "./Map/Map";
import Favicon from "./components/Favicon";

import Typography from "typography";
// import judahTheme from "typography-theme-judah";
// import moragaTheme from "typography-theme-moraga";
// import githubTheme from "typography-theme-github";
import sutroTheme from "typography-theme-sutro";

const typography = new Typography(sutroTheme);

// Output CSS as string.
typography.toString();

// Or insert styles directly into the <head> (works well for client-only
// JS web apps.
typography.injectStyles();

const snap = navigator.userAgent === "ReactSnap";

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
        <Favicon />
        {!snap && <Map />}
      </AppLayout>
    );
  }
}

export default App;
