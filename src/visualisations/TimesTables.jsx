import React from 'react'
import styled from '@emotion/styled'
import {
  point,
  line,
  circle,
  drawLine,
  drawCircle,
} from 'Utils/drawing'

class TimesTables extends React.Component {
  constructor(props) {
    super(props)
    this._canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this._canvas.current.getContext('2d')
    drawCircle(this.ctx, circle(point(500, 500), 400, {
      strokeColor: 'black'
    }))
  }

  render() {
    return (
      <Container id="times" ref={this._canvas} width="1000" height="1000" />
    )
  }
}

const Container = styled.canvas({
  height: '1000px',
  width: '1000px'
})

export default TimesTables