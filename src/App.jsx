import React from 'react'
import { connect } from 'react-redux'
import TimesTables from 'App/visualisations/TimesTables'
import Sierspinki from 'App/visualisations/Sierspinki'

class App extends React.Component {
  render() {
    return <TimesTables />
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(App)
