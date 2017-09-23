/* eslint-disable react/prefer-stateless-function class-methods-use-this*/
import React from 'react';
import styles from './styles.less';

class App extends React.Component {

render() {
    return (
     <div className={styles.myDiv}>
        <h1 className={styles.hello}>Hello World</h1>
      </div>);
  }
}

export default App;
