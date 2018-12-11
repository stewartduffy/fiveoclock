import React, { Component } from "react";
import Map from "./Map/Map";
import styles from "./App.module.css";

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Map />
      </div>
    );
  }
}

export default App;
