import { Action } from 'redux'

const initialState = {
  loaded: false
}

type State = typeof initialState

export default (state: State, action: Action<any>) => state