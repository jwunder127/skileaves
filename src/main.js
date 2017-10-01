import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, IndexRoute} from 'react-router-dom';
import AppContainer from './containers/AppContainer';
import AdminContainer from './containers/AdminContainer';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={AppContainer} />
      <Route path="/admin" component={AdminContainer} />
    </div>
  </BrowserRouter>,
  document.getElementById('main')
);
