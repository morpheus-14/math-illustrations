import React, { RefObject } from 'react'
import styled from '@emotion/styled'
import anime from 'animejs'
import {
  Point,
  Styles,
  Line,
  Circle,
  point,
  style,
  line,
  circle,
  drawLine,
  drawCircle,
} from 'Utils/drawing'

const center: Point = point(500, 500)
const radius: number = 400

const modulo: number = 150
const timesStart: number = 1
const timesEnd: number = 100

const aquaFill: Partial<Styles> = {
  fill: 'aqua'
}

const blackStroke: Partial<Styles> = {
  strokeColor: 'black'
}

const getJoinPoints: (circle: Omit<Circle, 'styles'>, mod: number) => Point[] = ({ c: { x, y }, r }, mod) => {
  const pts = Array.from(Array(mod).keys())
  return pts.map((idx) => ({
    x: x - r * Math.cos(Math.PI * 2 * idx / mod),
    y: y - r * Math.sin(Math.PI * 2 * idx / mod),
  }))
}

const getJoinLines: (circle: Omit<Circle, 'styles'>, table: number, mod: number) => Line[] = (circle, table, mod) => {
  const points = getJoinPoints(circle, mod)
  return points.map((pt, idx) => ({
    a: pt,
    b: points[Math.floor(idx * table) % mod]
  } as Line))
}

type State = {}

type Props = {}

class TimesTables extends React.Component<State, Props> {
  _canvas: RefObject<any>
  ctx: CanvasRenderingContext2D | null
  constructor(props) {
    super(props)
    this._canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this._canvas.current.getContext('2d')
    if (!this.ctx) return
    const ctx: CanvasRenderingContext2D = this.ctx
    const mainCircle = circle(center, radius)

    let table = { times: timesStart }
    anime({
      targets: table,
      times: {
        value: timesEnd,
        duration: '20000'
      },
      round: 2,
      easing: 'linear',
      update: () => {
        ctx.clearRect(0, 0, 1000, 1000)
        drawCircle(ctx, style(mainCircle, blackStroke))
        const lines = getJoinLines(mainCircle, table.times, modulo)
        lines.forEach((line) => drawLine(ctx, style(line, blackStroke)))
      }
    });
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