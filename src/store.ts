import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createRootReducer from 'Reducers/index'
// import { actionTypeToObjectString, actionTypeToString } from 'Utils'

export const sagaMiddleware = createSagaMiddleware()

declare const window: any
declare const ENV: any
declare const module: any

const initialState = {}
const enhancers = []
const middleware = [
  sagaMiddleware
]

if (ENV != "prod") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    // enhancers.push(devToolsExtension({
    //   serialize: {
    //     replacer: (key, value) => {
    //       if (!value) return value
    //       const { action = "" } = value
    //       if (typeof action != "string" && typeof action.type != "string") {
    //         const payload = action.payload ? { payload: action.payload } : {}
    //         return {
    //           ...value,
    //           action: { igType: actionTypeToObjectString(action.type), type: actionTypeToString(action.type), ...payload }
    //         }
    //       }
    //       return value
    //     }
    //   }
    //  }))
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  createRootReducer,
  composedEnhancers
)

export default store
