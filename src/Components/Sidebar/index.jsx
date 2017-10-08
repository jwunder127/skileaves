import React from 'react';
import { Row, Card, Input, Icon } from 'antd';
import styles from './styles.less';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mountains: this.props.mountains,
      mtnSearch: '',
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.mountains){
      this.setState({
        mountains: nextProps.mountains
      });
    }
  }

  handleSearchInput = (evt) => {
    console.log('value:', evt.target.value);
    this.setState({
      mtnSearch: evt.target.value
    });
  }

  searchBarFilter(value){
    return this.state.mountains.filter(mtn => {
      return mtn.name.toLowerCase().match(value.toLowerCase());
    });
  }

  render(){
    const visibleMtns = this.state.mtnSearch.length ?
                        this.searchBarFilter(this.state.mtnSearch) :
                        this.state.mountains;
    return (
      <div>
        <Input
          prefix={<Icon type="caret-up" />}
          onChange={this.handleSearchInput}
          placeholder="Search Mountains"
        />
        {visibleMtns && visibleMtns.map(mtn => {
          return (
          <Row key={mtn.id}>
            <Card
              className={styles.mtnCard}
              onClick={() => console.log(mtn.name)}
            >
              <p>{mtn.name}</p>
              <p>Snowscore:
                <span style={{color: this.props.getColor(mtn.snowScoreAdj)}}>
                  {mtn.snowScore}
                </span>
              </p>
            </Card>
          </Row>
          );
        })}
      </div>
    );
  }
}

export default Sidebar;
