import { useEffect, useRef } from 'react'

// Cursor trail: a fixed, pointer-transparent canvas that emits small
// metallic sparkle particles when the cursor moves fast. Particles are
// pooled, drawn from three pre-rendered sprites, and the rAF loop only
// runs while particles are alive.
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Pre-rendered 8-point sparkle sprites in the metallic palette.
    const makeSprite = (r: number, g: number, b: number) => {
      const s = document.createElement('canvas')
      s.width = s.height = 64
      const x = s.getContext('2d')!
      const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.5)`)
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.1)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      x.fillStyle = grad
      x.fillRect(0, 0, 64, 64)
      x.fillStyle = `rgba(${r},${g},${b},0.95)`
      const spike = (len: number, wid: number, rot: number) => {
        x.save()
        x.translate(32, 32)
        x.rotate(rot)
        x.beginPath()
        x.moveTo(0, -len)
        x.quadraticCurveTo(wid, 0, 0, len)
        x.quadraticCurveTo(-wid, 0, 0, -len)
        x.fill()
        x.restore()
      }
      spike(26, 2.4, 0)
      spike(26, 2.4, Math.PI / 2)
      spike(12, 1.6, Math.PI / 4)
      spike(12, 1.6, -Math.PI / 4)
      return s
    }
    const sprites = [
      makeSprite(229, 229, 229), // #E5E5E5
      makeSprite(207, 207, 207), // #CFCFCF
      makeSprite(245, 245, 245), // #F5F5F5
    ]

    type P = {
      x: number; y: number; vx: number; vy: number
      age: number; life: number; size: number; rot: number
      twinkle: number; sprite: HTMLCanvasElement
    }
    const MAX = 180
    const pool: P[] = []
    let running = false
    let raf = 0
    let last = 0

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 16.7 // in 60fps frames
      last = now
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i]
        p.age += dt * 16.7
        if (p.age >= p.life) {
          pool.splice(i, 1)
          continue
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx = p.vx * 0.985 + (Math.random() - 0.5) * 0.04
        p.vy = p.vy * 0.985 + (Math.random() - 0.5) * 0.04 - 0.008 * dt
        const t = p.age / p.life
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
        const alpha =
          fade * (0.55 + 0.45 * Math.sin(p.age * 0.02 + p.twinkle)) * 0.85
        ctx.globalAlpha = Math.max(0, alpha)
        const s = p.size * (1 + t * 0.35) * 2.6 // sprite includes glow margin
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      if (pool.length > 0) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }
    const wake = () => {
      if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    let px = -1
    let py = -1
    let pt = 0
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (px < 0) {
        px = e.clientX; py = e.clientY; pt = now
        return
      }
      const dx = e.clientX - px
      const dy = e.clientY - py
      const dtm = Math.max(1, now - pt)
      const speed = Math.hypot(dx, dy) / dtm // px per ms
      // Slow movement emits nothing; fast flicks emit a small burst.
      const count = Math.min(5, Math.floor((speed - 0.45) * 3.2))
      if (count > 0 && pool.length < MAX) {
        for (let i = 0; i < count; i++) {
          const f = Math.random() // spawn along the traveled segment
          const ang = Math.random() * Math.PI * 2
          const drift = 0.25 + Math.random() * 0.9
          pool.push({
            x: px + dx * f + (Math.random() - 0.5) * 10,
            y: py + dy * f + (Math.random() - 0.5) * 10,
            vx: Math.cos(ang) * drift + dx * 0.012,
            vy: Math.sin(ang) * drift + dy * 0.012,
            age: 0,
            life: 800 + Math.random() * 700, // 0.8s - 1.5s
            size: 2 + Math.random() * 4,
            rot: Math.random() * Math.PI,
            twinkle: Math.random() * Math.PI * 2,
            sprite: sprites[(Math.random() * sprites.length) | 0],
          })
        }
        wake()
      }
      px = e.clientX; py = e.clientY; pt = now
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[5] pointer-events-none"
      style={{ mixBlendMode: 'screen', filter: 'blur(0.4px)' }}
    />
  )
}
