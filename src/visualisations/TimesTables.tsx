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
  stroke,
  line,
  circle,
  drawLine,
  drawCircle,
} from 'Utils/drawing'
import {
  Animatable
} from 'Utils/animation'

type Props = {
  center: Point
  radius: number

  modulo: Animatable,
  table: Animatable,
}

class TimesTables extends React.Component<Partial<Props>> {
  _canvas: RefObject<any>
  ctx: CanvasRenderingContext2D | null

  static defaultProps: Props = {
    center: point(500, 500),
    radius: 400,
    modulo: {
      start: 150,
      end: 100,
      duration: 20,
    },
    table: {
      start: 51,
      end: 100,
      duration: 40
    }
  }

  constructor(props) {
    super(props)
    this._canvas = React.createRef()
    this.ctx = null
  }

  componentDidMount() {
    this.ctx = this._canvas.current.getContext('2d')
    if (!this.ctx) return

    init(this.ctx, this.props as Props)
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


////
const init: (context: CanvasRenderingContext2D | null, props: Props) => void =
  (ctx, { center, radius, modulo, table }) => {
    if (!ctx) return
    const mainCircle = circle(center, radius)
    ctx.save()

    let animator = { table: table.start, modulo: modulo.start }
    anime({
      targets: animator,
      table: {
        value: table.end,
        duration: table.duration * 1000
      },
      modulo: {
        value: modulo.end,
        duration: modulo.duration * 1000
      },
      loop: true,
      direction: 'alternate',
      easing: 'linear',
      update: () => {
        ctx.clearRect(100, 100, 900, 900)
        drawCircle(ctx, style(mainCircle, stroke(getColor(6, 1))))
        const lines = getJoinLines(mainCircle, animator.table, parseInt(animator.modulo.toString()))
        lines.forEach((line, idx) => drawLine(ctx, style(line, stroke(getColor(idx, animator.table)))))
      }
    })
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

export default TimesTables