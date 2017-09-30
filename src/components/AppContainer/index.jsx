/* eslint-disable react/prefer-stateless-function class-methods-use-this*/
import React from 'react';
import styles from './styles.less';
import LeafletMap from '../LeafletMap';
import axios from 'axios';

class AppContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

componentWillMount(){
  axios.get('/api/mountains')
    .then(res => {
      console.log(res);
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
          />
        </div>
        <div className={styles.sidebarDiv}>
          <h1> Hello world! </h1>
        </div>
      </div>);
  }
}

export default AppContainer;
