if (process.env.NODE_ENV !== 'development') {
    require('offline-plugin/runtime').install()
}

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import configureStore from 'store'


const store = configureStore()
const rootElement = document.getElementById('root')
const history = syncHistoryWithStore(hashHistory, store)

if (process.env.NODE_ENV === 'development') {
  window.store = store;
}

render(
    <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={App} />
        </Router>
    </Provider>,
    rootElement
);
