import React from 'react';
import { Button } from 'antd';
import axios from 'axios';

const onUpdateButtonClick = function(){
  axios.get('/api/mountains')
    .then(res => {
        const mountains = res.data;
        const locationArr = mountains.map(mtn => [mtn.latitude, mtn.longitude, mtn.operating_status, mtn.updated_at]);
        const locationSample = [locationArr[0]];
        console.log('refreshMountains', locationArr);
        axios.post('/api/mountains/updateAllForecasts', {mtnArray: locationArr})
        .then(response => console.log('update response:', response))
        .catch(err => console.log('update error:', err));
    })
    .catch(err => console.log('error updating mtns:', err));
};

const onRefreshButtonClick = function(){
  axios.get('/api/mountains')
    .then(res => console.log('getMountains', res.data))
    .catch(err => console.log('err:', err));
}

class AdminContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return(
      <div>
        This is the Admin Page
        <Button onClick={onUpdateButtonClick}> Click to refresh mountains </Button>
        <Button onClick={onRefreshButtonClick}> Click to get latest mountains </Button>
      </div>
    )
  }
}

export default AdminContainer;
