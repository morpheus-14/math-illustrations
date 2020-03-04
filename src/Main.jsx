import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store, { sagaMiddleware, history } from './store'
import rootSaga from 'Sagas'

sagaMiddleware.run(rootSaga)

const renderApp = () =>
  render(
      <Provider store={store}>
          <App />
      </Provider>,
      document.getElementById("app"),
  )

renderApp()


// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    renderApp()
  })
}
