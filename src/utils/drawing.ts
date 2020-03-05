// TODO: Support for unit and other coordinate systems
type Point = {
  x: number
  y: number
}

type Color = string

export interface Styles {
  strokeWidth: number
  strokeColor: Color
  strokeDash: number[]
  strokeDashOffset: number
  strokeLineCap: CanvasLineJoin
  strokeLineJoin: CanvasLineCap
  strokeMiterLimit: number
  fill: Color
  // TODO: Add remaining properties supported by canvas
}

export interface Styled {
  styles: Partial<Styles>
}

interface Line extends Styled {
  a: Point
  b: Point
}

interface Circle extends Styled {
  c: Point
  r: number
}

export const point: (x: number, y: number) => Point = (x, y) => ({ x, y })

export const line: (a: Point, b: Point, styles?: Partial<Styles>) => Line = (a, b, styles = {}) => ({ a, b, styles })

export const circle: (c: Point, r: number, styles?: Partial<Styles>) => Circle = (c, r, styles = {}) => ({ c, r, styles })

export const drawLine: (context: CanvasRenderingContext2D, line: Line) => void = (ctx, line) => {
  ctx.moveTo(line.a.x, line.a.y)
  ctx.lineTo(line.b.x, line.b.y)
  setStyles(ctx, line.styles)
  ctx.stroke()
  ctx.restore()
}

export const drawCircle: (context: CanvasRenderingContext2D, circle: Circle) => void = (ctx, circle) => {
  ctx.beginPath()
  ctx.arc(circle.c.x, circle.c.y, circle.r, 0, 2 * Math.PI)
  setStyles(ctx, circle.styles)
  if (circle.styles.fill) { ctx.fill() }
  if (circle.styles.strokeColor) { ctx.stroke() }
  ctx.closePath()
  ctx.restore()
}

const setStyles: (context: CanvasRenderingContext2D, styles?: Partial<Styles>) => void = (ctx, styles = {}) => {
  const styleMap = {
    strokeWidth: (width: number) => { ctx.lineWidth = width },
    strokeColor: (color: Color) => { ctx.strokeStyle = color },
    strokeDash: (dash: number[]) => { ctx.setLineDash(dash) },
    strokeDashOffset: (offset: number) => { ctx.lineDashOffset = offset },
    strokeLineCap: (cap: CanvasLineCap) => { ctx.lineCap = cap },
    strokeLineJoin: (join: CanvasLineJoin) => { ctx.lineJoin = join },
    strokeMiterLimit: (lim: number) => { ctx.miterLimit = lim },
    fill: (color: Color) => { ctx.fillStyle = color }
  }
  Object.keys(styles).forEach((style) => styleMap[style](styles[style]))
}
