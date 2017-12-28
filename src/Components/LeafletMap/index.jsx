import React from 'react';
import { Map, TileLayer, Circle, Popup, ScaleControl, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import styles from './styles.less';
const darkMatter = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

const icon = divIcon({
    className: styles.mtnLabel,
    html: 'title'});

const renderMarker = (zoomLevel, mtn) => {
    // console.log('render marker called, zoom level:', zoomLevel);
    return zoomLevel > 9 ?
        <Marker
            icon={divIcon({
                className: styles.mtnLabel,
                html: mtn.name
            })}
            position={[mtn.latitude, mtn.longitude]}
        /> : null;
};

const zoomChange = (zoomLevel) => {
    this.setState({zoomLevel})
};

class LeafletMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        allMountains: this.props.mountains,
        visibleMountains: this.props.mountains
    };
  }

  componentWillReceiveProps(nextProps){
      console.log('new props received');
      if(nextProps.mountains){
          this.setState({
              visibleMountains: nextProps.mountains,
              allMountains: nextProps.mountains,
          })
      }
  }

  calculateVisibleMountains = (map, evt) => {
    console.log('move detected');
    // debugger;
    if (!map || !map.leafletElement || !this.state.allMountains) return;
    const bounds = map.leafletElement.getBounds();
    const northEast = bounds._northEast;
    const southWest = bounds._southWest;

    const newMountains = this.state.allMountains.filter((mtn) => {
        return mtn.latitude < northEast.lat &&
                mtn.latitude > southWest.lat &&
                mtn.longitude < northEast.lng &&
                mtn.longitude > southWest.lng;
    });
    this.setState({
        visibleMountains: newMountains
    });
  };

  render(){

    return (
      <div>
        <Map ref='map' center={this.props.userPosition} zoom={this.props.userZoom} onMoveend={(e) => this.calculateVisibleMountains(this.refs.map, e)} onZoomstart={(e) => console.log('zoom changed', e.target._zoom)}>
          <TileLayer
           layer="CartoDB_DarkMatter"
           url={darkMatter}
         />
          <ScaleControl />
            {this.state.visibleMountains && this.state.visibleMountains.map(mtn => {
              return (
                <div key={mtn.id}>
                    {renderMarker(this.state.zoomLevel, mtn)}
                    <Circle
                    center={[mtn.latitude, mtn.longitude]}
                    radius={1000}
                    color={this.props.getColor(mtn.snowScoreAdj)}
                    title={mtn.name}
                  >
                    <Popup>
                        <h4>
                            {mtn.name}
                        </h4>
                    </Popup>
                  </Circle>
                </div>
              );
            })}
        </Map>
      </div>
    );
  }
}

export default LeafletMap;

/*
Note: to get user's location, use navigator.geolocation.getCurrentPosition();

function will take one argument (callback function). The parameter of that callback
function is an object with coords (which contains an object with lat/long) and a timestamp
Put map center on state, initally set it to the middle of the country but as soon
as the user allows for their location to be found, set it to the user's location.
*/
