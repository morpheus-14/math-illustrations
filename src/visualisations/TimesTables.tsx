import React, { RefObject } from 'react'
import styled from '@emotion/styled'
import anime from 'animejs'
import {
  Point,
  Styles,
  Color,
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
const timesStart: number = 51
const timesEnd: number = 100

const aquaFill: Partial<Styles> = {
  fill: 'aqua'
}

const stroke: (color: Color) => Partial<Styles> = (color) => ({ strokeColor: color })

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

const getColor: (idx: number, mul: number) => Color = (idx, mul) => {
  const colors: Color[] = [
    "#e056fd",
    "#686de0",
    "#30336b",
    "#badc58",
    "#ff7979",
    "#ffbe76",
  ]
  return colors[Math.floor(idx / mul) % colors.length]
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
    ctx.save()

    let table = { times: timesStart, mod: modulo }
    anime({
      targets: table,
      times: {
        value: timesEnd,
        duration: '40000'
      },
      mod: {
        value: 100,
        duration: '20000'
      },
      loop: true,
      direaction: 'alternate',
      easing: 'linear',
      update: () => {
        ctx.clearRect(100, 100, 900, 900)
        drawCircle(ctx, style(mainCircle, stroke('black')))
        const lines = getJoinLines(mainCircle, table.times, parseInt(table.mod + ""))
        lines.forEach((line, idx) => drawLine(ctx, style(line, stroke(getColor(idx, table.times)))))
      }
    })
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