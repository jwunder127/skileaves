/* eslint-disable react/prefer-stateless-function class-methods-use-this*/
import React from 'react';
import styles from './styles.less';
import LeafletMap from '../LeafletMap';
import axios from 'axios';

class AppContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      mountains: []
    };
  }

componentDidMount(){
  axios.get('/mountains')
    .then(mountains => {
      console.log(mountains);
      this.setState({
        mountains
      });
    });
}

render() {
    console.log('state is:', this.state, Date.now());
    return (
     <div className={styles.mainContainer}>
        <div className={styles.mapDiv}>
          <LeafletMap />
        </div>
        <div className={styles.sidebarDiv}>
          <h1> Hello world! </h1>
        </div>
      </div>);
  }
}

export default AppContainer;
