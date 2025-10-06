"use client"

import { useEffect, useRef } from "react"

export function CanvasMock() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    let width = 800
    let height = 500

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = Math.max(640, Math.floor(rect?.width ?? 800))
      height = Math.floor(width * 0.6)
      canvas.width = width
      canvas.height = height
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    let t = 0
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function draw() {
      // background
      ctx.clearRect(0, 0, width, height)
      // subtle board bg
      ctx.fillStyle = "rgba(0,0,0,0.03)"
      ctx.fillRect(0, 0, width, height)

      // grid
      ctx.strokeStyle = "rgba(0,0,0,0.06)"
      ctx.lineWidth = 1
      const step = 24
      for (let x = 0; x < width; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // doodle strokes with slight jitter
      const baseHue1 = 210 // uses brand-ish blue
      const baseHue2 = 190 // cyan-ish
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      function stroke(h: number, seed: number) {
        ctx.strokeStyle = `hsla(${h}, 85%, 55%, 0.9)`
        ctx.lineWidth = 3
        ctx.beginPath()
        const points = 7
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * (width - 60) + 30
          const y = height * 0.3 + Math.sin(i * 0.8 + t * 0.02 + seed) * 20
          const jitterX = Math.sin((i + seed) * 1.3 + t * 0.03) * 1.2
          const jitterY = Math.cos((i + seed) * 1.1 + t * 0.03) * 1.2
          if (i === 0) ctx.moveTo(x + jitterX, y + jitterY)
          else ctx.lineTo(x + jitterX, y + jitterY)
        }
        ctx.stroke()
      }

      stroke(baseHue1, 1.7)
      stroke(baseHue2, 3.1)

      // sticky notes
      function note(x: number, y: number, w: number, h: number, hue: number) {
        ctx.fillStyle = `hsla(${hue}, 85%, 60%, 0.9)`
        ctx.strokeStyle = "rgba(0,0,0,0.15)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, 10)
        ctx.fill()
        ctx.stroke()
      }
      note(40, height * 0.55, 120, 80, 50) // yellow
      note(200, height * 0.62, 120, 80, 340) // magenta
      note(360, height * 0.58, 120, 80, 200) // cyan

      if (!prefersReduced) t += 1.5
      raf.current = requestAnimationFrame(draw)
    }

    raf.current = requestAnimationFrame(draw)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas ref={ref} className="block w-full h-auto bg-[var(--card)]" aria-label="Animated drawing canvas mockup" />
  )
}
