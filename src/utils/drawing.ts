// TODO: Support for unit and other coordinate systems
export type Point = {
  x: number
  y: number
}

export type Color = string

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

export interface Line extends Styled {
  a: Point
  b: Point
}

export interface Circle extends Styled {
  c: Point
  r: number
}

export interface Triangle extends Styled {
  a: Point
  b: Point
  c: Point
}

// constructors for shapes and builder fns for styles
export const point: (x: number, y: number) => Point = (x, y) => ({ x, y })

export const line: (a: Point, b: Point, styles?: Partial<Styles>) => Line = (a, b, styles = {}) => ({ a, b, styles })

export const circle: (c: Point, r: number, styles?: Partial<Styles>) => Circle = (c, r, styles = {}) => ({ c, r, styles })

export const triangle: (a: Point, b: Point, c: Point, styles?: Partial<Styles>) => Triangle = (a, b, c, styles = {}) => ({ a, b, c, styles })

export const style: <T>(shape: T, styles: Partial<Styles>) => T = (shape, styles) => ({ ...shape, styles })

export const fill: (color: Color) => Partial<Styles> = (color) => ({ fill: color })

export const stroke: (color: Color) => Partial<Styles> = (color) => ({ strokeColor: color })


// drawing utils
export const drawLine: (context: CanvasRenderingContext2D, line: Line) => void = (ctx, { a, b, styles }) => {
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  setStyles(ctx, styles)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

export const drawCircle: (context: CanvasRenderingContext2D, circle: Circle) => void = (ctx, { c, r, styles }) => {
  ctx.beginPath()
  ctx.arc(c.x, c.y, r, 0, 2 * Math.PI)
  setStyles(ctx, styles)
  if (styles.fill) { ctx.fill() }
  if (styles.strokeColor) { ctx.stroke() }
  ctx.closePath()
  ctx.restore()
}

export const drawTriangle: (context: CanvasRenderingContext2D, triangle: Triangle) => void = (ctx, {a, b, c, styles}) => {
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.lineTo(a.x, a.y)
  setStyles(ctx, styles)
  if (styles.fill) { ctx.fill() }
  if (styles.strokeColor) { ctx.stroke() }
  ctx.closePath()
  ctx.restore()
}


// style property setter
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
