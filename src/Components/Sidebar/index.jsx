import React from 'react';
import { Row, Card, Input, Icon } from 'antd';
import styles from './styles.less';

const CardGrid = Card.Grid;

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mountains: this.props.mountains,
      mtnSearch: '',
    };
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.mountains){
      this.setState({
        mountains: nextProps.mountains
      });
    }
  }

  handleSearchInput(evt){
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
          prefix={<Icon type='caret-up' />}
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
              {mtn.name}
            </Card>
          </Row>
          );
        })}
      </div>
    );
  }
}

export default Sidebar;
