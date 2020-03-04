import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    return <div>Hello</div>
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(App)
