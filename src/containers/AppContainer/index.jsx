/* eslint-disable react/prefer-stateless-function class-methods-use-this*/
import React from 'react';
import axios from 'axios';
import styles from './styles.less';
import LeafletMap from '../../components/LeafletMap';
import Sidebar from '../../components/Sidebar';

import {Card} from 'antd';

class AppContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userPosition: [45.784361, -101.850954],
      userZoom: 4
    };
  }

componentWillMount(){
  window.navigator.geolocation.getCurrentPosition((data) => {
    this.setState({
      userPosition: [data.coords.latitude, data.coords.longitude],
      userZoom: 7
    });
  });
  axios.get('/api/mountains')
    .then(res => {
      this.setState({
        mountains: res.data
      });
    });
}

render() {
  console.log('mountains:', this.state.mountains);
    return (
      <div className={styles.mainContainer}>
        <div className={styles.mapDiv}>
          <LeafletMap
            mountains={this.state.mountains}
            userPosition={this.state.userPosition}
            userZoom={this.state.userZoom}
          />
        </div>
        <div className={styles.sidebarDiv}>
          <Sidebar
            mountains={this.state.mountains}
          />
        </div>
      </div>
     );
  }
}

export default AppContainer;
