/* eslint-disable react/prefer-stateless-function class-methods-use-this*/
import React from 'react';
import axios from 'axios';
import styles from './styles.less';
import LeafletMap from '../../components/LeafletMap';
import Sidebar from '../../components/Sidebar';


const getColor = (score) => {

  if (score > 80) return '#f142f2';
  if (score > 64) return '#9842f4';
  if (score > 48) return '#4265f4';
  if (score >  32) return '#42e5f4';
  if (score >  16) return '#42f468';
  if (score >  0) return '#95a88d';
                  return '#918c91';
};

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
            getColor={getColor}
          />
        </div>
        <div className={styles.sidebarDiv}>
          <Sidebar
            mountains={this.state.mountains}
            getColor={getColor}
          />
        </div>
      </div>
     );
  }
}

export default AppContainer;
