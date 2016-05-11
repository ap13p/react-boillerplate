import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import reducers from 'reducers'
import { routerMiddleware } from 'react-router-redux'
import { hashHistory } from 'react-router'
import thunk from 'redux-thunk'

const isDevelopment = process.env.BUILD_ENV === 'development'
const isChromeDevtoolExtensionInstalled = (typeof window === 'object') &&
  (typeof window.devToolsExtension !== 'undefined')

const middlewares = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(hashHistory)),
  isDevelopment
    ? applyMiddleware(createLogger())
    : f => f,
  (isDevelopment && isChromeDevtoolExtensionInstalled)
    ? window.devToolsExtension()
    : f => f
)

const configureStore = (initialState) => {
  const store = createStore(reducers, initialState, middlewares)
  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextReducer = require('reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default configureStore
