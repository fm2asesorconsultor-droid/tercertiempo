"use client"

import { useEffect, useRef, useState } from "react"

// Matches the grid baked into public/ball-sprite.webp by generate-ball-frames.js.
// If that script is re-run with different constants, update these to match.
const FRAME_COUNT = 24
const GRID_COLS = 6
const GRID_ROWS = 4

const IDLE_INTERVAL_MS = 150
const DRAG_PX_PER_ROTATION = 280

export function FootballMobileSprite() {
  const [frame, setFrame] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startY: number; startFrame: number; active: boolean; horizontal: boolean } | null>(null)

  useEffect(() => {
    // Preload the sprite so the ball never flashes blank on first paint
    // while the background-image is still downloading/decoding.
    const img = new window.Image()
    img.onload = () => setLoaded(true)
    img.src = "/ball-sprite.webp"
    if (img.complete) setLoaded(true)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (dragState.current?.active) return
      setFrame((f) => (f + 1) % FRAME_COUNT)
    }, IDLE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      dragState.current = { startX: t.clientX, startY: t.clientY, startFrame: frame, active: true, horizontal: false }
    }

    const onTouchMove = (e: TouchEvent) => {
      const drag = dragState.current
      if (!drag) return
      const t = e.touches[0]
      const deltaX = t.clientX - drag.startX
      const deltaY = t.clientY - drag.startY

      if (!drag.horizontal) {
        if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return
        drag.horizontal = Math.abs(deltaX) > Math.abs(deltaY)
        if (!drag.horizontal) {
          // Vertical swipe: let the page scroll normally, stop tracking this gesture.
          dragState.current = null
          return
        }
      }

      e.preventDefault()
      const framesDelta = Math.round((deltaX / DRAG_PX_PER_ROTATION) * FRAME_COUNT)
      const next = ((drag.startFrame + framesDelta) % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT
      setFrame(next)
    }

    const onTouchEnd = () => {
      dragState.current = null
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: true })
    el.addEventListener("touchcancel", onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [frame])

  const col = frame % GRID_COLS
  const row = Math.floor(frame / GRID_COLS)
  const backgroundPosition = `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 mx-auto drop-shadow-[0_0_30px_rgba(255,69,0,0.4)] touch-pan-y cursor-grab active:cursor-grabbing transition-opacity duration-300"
      style={{
        backgroundImage: "url(/ball-sprite.webp)",
        backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
        backgroundPosition,
        backgroundRepeat: "no-repeat",
        opacity: loaded ? 1 : 0,
      }}
      role="img"
      aria-label="Balón de fútbol Tercer Tiempo"
    />
  )
}
