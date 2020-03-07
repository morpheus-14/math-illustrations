import React, { RefObject } from 'react'
import styled from '@emotion/styled'
import anime from 'animejs'
import {
  Point,
  Styles,
  Color,
  Triangle,
  point,
  style,
  stroke,
  triangle,
  drawLine,
  drawTriangle,
  fill,
} from 'Utils/drawing'
import {
  Animatable
} from 'Utils/animation'

type Props = {
  base: Triangle
  zoom: Animatable
  iterations: Animatable
}

class Sierspinki extends React.Component<Partial<Props>> {
  _canvas: RefObject<any>
  ctx: CanvasRenderingContext2D | null

  static defaultProps: Props = {
    base: {
      a: point(100, 800),
      b: point(700, 800),
      c: point(400, 800 - (300 * Math.sqrt(3))),
      styles: stroke('black')
    },
    iterations: {
      start: 0,
      end: 4,
      duration: 4,
    },
    zoom: {
      start: 1,
      end: 1,
      duration: 5,
    },
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
      <Container ref={this._canvas} width="1000" height="1000" />
    )
  }
}

const Container = styled.canvas({
  height: '1000px',
  width: '1000px'
})


////
const init: (context: CanvasRenderingContext2D | null, props: Props) => void =
  (ctx, { base, iterations, zoom }) => {
    if (!ctx) return
    ctx.save()

    let animator = { iterations: iterations.start, zoom: zoom.start }
    drawTriangle(ctx, base)
    let curr = [ base ]
    let currIteration = iterations.start
    let step = true

    anime({
      targets: animator,
      iterations: {
        value: iterations.end,
        duration: iterations.duration * 1000
      },
      zoom: {
        value: zoom.end,
        duration: zoom.duration * 1000
      },
      easing: 'linear',
      round: 1,
      update: () => {
        if (!(Math.floor(animator.iterations) - currIteration)) { 
          if (!step) return
          console.log(currIteration)
          curr.forEach(bs => drawTriangle(ctx, style(currentTriangle(bs), fill('aqua'))))
          let triangles: Triangle[] = []
          curr.forEach(bs => {
            triangles = triangles.concat(nextIteration(bs))
          })
          curr = triangles
          curr.forEach(bs => drawTriangle(ctx, style(bs, fill('rgba(200, 100, 120, 0.2)'))))
          step = false
        } else {
          currIteration = Math.floor(animator.iterations)
          step = true
        }
        if (iterations.end - Math.floor(animator.iterations) <= 0) return
      }
    })
  }


const getStyle: (iteration: number) => Partial<Styles> = iteration => (iteration % 2 ? fill('blue') : fill('black'))

const currentTriangle: (base: Triangle) => Triangle = ({ a, b, c }) => triangle(midPoint(a, b), midPoint(b, c), midPoint(c, a))

const nextIteration: (base: Triangle) => Triangle[] = base => {
  const { a, b, c } = currentTriangle(base)
  const tA: Triangle = triangle(base.a, a, c)
  const tB: Triangle = triangle(base.b, a, b)
  const tC: Triangle = triangle(base.c, b, c)
  return [ tA, tB, tC ]
}

const midPoint: (a: Point, b: Point) => Point = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
})



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

export default Sierspinki