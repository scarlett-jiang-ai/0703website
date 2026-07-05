import { useEffect, useRef } from 'react'
import handHuman from '../../Picture/hand-human.png'
import handRobot from '../../Picture/hand-robot.png'
import ClosingSection from '../ClosingSection'
import { useFadeUp } from '../useFadeUp'

// Resolved lazily via glob so the build succeeds even before the video
// file is pushed to the repo; once Video/0704dexterous-hand.mp4 exists it
// is bundled and picked up automatically.
const videoAssets = import.meta.glob('../../Video/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const dexterousHandVideo = videoAssets['../../Video/0704dexterous-hand.mp4']
const touchVideo = videoAssets['../../Video/0704-hand2.mp4']

// Source image geometry (Picture/two-hands.png, 1684x934). The two hand
// layers are crops of it: human = x [0, 900], robot = x [800, 1684].
// Fingertips sit at (792, 538) and (922, 496); they close along the axis
// between them and meet at the midpoint (857, 517).
const IMG_W = 1684
const IMG_H = 934
const AXIS_X = 0.9515 // unit vector human tip -> robot tip
const AXIS_Y = -0.3074
const APART = 34 // extra initial separation per hand, image px
const CLOSE = 72 // travel per hand from rest position to contact, image px
const HANDS_END = 0.82 // hands finish closing at this fraction of the pin

export default function HomePage() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const humanRef = useRef<HTMLImageElement>(null)
  const robotRef = useRef<HTMLImageElement>(null)
  const videoSceneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    document.title = 'Agile Hand — Adaptive Robotic Hands'
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    const sticky = stickyRef.current
    const cover = coverRef.current
    const human = humanRef.current
    const robot = robotRef.current
    if (!scene || !sticky || !cover || !human || !robot) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Replicates background-size:cover for the two-layer composite.
    let scale = 1
    let vw = 0
    let vh = 0
    const resize = () => {
      vw = sticky.clientWidth
      vh = sticky.clientHeight
      scale = Math.max(vw / IMG_W, vh / IMG_H)
      cover.style.width = `${IMG_W * scale}px`
      cover.style.height = `${IMG_H * scale}px`
    }
    resize()
    window.addEventListener('resize', resize)

    let mouseXT = 0
    let mouseYT = 0
    let mouseX = 0
    let mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseXT = e.clientX / window.innerWidth - 0.5
      mouseYT = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMouse)

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    let progress = 0
    let touched = false
    let raf = 0
    const tick = (now: number) => {
      const maxScroll = scene.offsetHeight - window.innerHeight
      const target = Math.min(1, Math.max(0, maxScroll > 0 ? window.scrollY / maxScroll : 0))
      progress = reduced ? target : progress + (target - progress) * 0.14

      const hp = easeInOut(Math.min(1, progress / HANDS_END))
      const d = (-APART + (APART + CLOSE) * hp) * scale

      // Push in just enough that the layers' crop edges (and the source
      // image's own edges) never enter the viewport as the hands move.
      // 12px margin absorbs mouse parallax + float drift.
      const shiftX = Math.abs(d) * AXIS_X + 12
      const shiftY = Math.abs(d) * -AXIS_Y + 12
      const zoom = Math.max(
        1,
        (vw + 2 * shiftX) / (IMG_W * scale),
        (vh + 2 * shiftY) / (IMG_H * scale),
      )
      cover.style.transform = `translate(-50%, -50%) scale(${zoom})`

      if (!touched && hp > 0.995) {
        touched = true
        sticky.classList.add('touched')
      } else if (touched && hp < 0.985) {
        touched = false
        sticky.classList.remove('touched')
      }

      mouseX += (mouseXT - mouseX) * 0.06
      mouseY += (mouseYT - mouseY) * 0.06
      const mx = reduced ? 0 : mouseX
      const my = reduced ? 0 : mouseY
      const f = reduced ? 0 : 1
      const f1x = Math.sin(now * 0.00021) * 4 * f
      const f1y = Math.sin(now * 0.00033 + 1.2) * 5 * f
      const f2x = Math.sin(now * 0.00025 + 2.1) * 4 * f
      const f2y = Math.sin(now * 0.00029 + 4.3) * 5 * f

      human.style.transform = `translate3d(${d * AXIS_X + mx * 10 + f1x}px, ${
        d * AXIS_Y + my * 7 + f1y
      }px, 0) rotate(${mx * 0.5 + Math.sin(now * 0.00019) * 0.25 * f}deg)`
      robot.style.transform = `translate3d(${-d * AXIS_X - mx * 13 + f2x}px, ${
        -d * AXIS_Y - my * 9 + f2y
      }px, 0) rotate(${-mx * 0.4 + Math.sin(now * 0.00023 + 2) * 0.2 * f}deg)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  // Scroll-scrubbed dexterous-hand video: playback is paused for good and
  // currentTime is driven from the pinned scene's scroll progress, so the
  // hand closes as you scroll down and reopens as you scroll back up.
  useEffect(() => {
    const video = videoRef.current
    const scene = videoSceneRef.current
    if (!video || !scene) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let duration = 0
    const onMeta = () => {
      duration = video.duration
      video.pause()
      video.currentTime = 0
    }
    if (video.readyState >= 1) onMeta()
    else video.addEventListener('loadedmetadata', onMeta)

    if (reduced) {
      // First frame only; no scroll binding.
      return () => video.removeEventListener('loadedmetadata', onMeta)
    }

    // The footage is a full open -> fist -> open cycle; the fist is tightest
    // at ~2.4s. Scrub only the closing half so scroll-down ends on the fist.
    const SCRUB_END = 2.4
    const FRAME = 1 / 30 // source is 30fps; skip sub-frame updates
    let smooth = 0
    let lastSet = -1
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!duration) return
      const vh = window.innerHeight
      const range = scene.offsetHeight - vh
      const p = Math.min(1, Math.max(0, -scene.getBoundingClientRect().top / range))
      smooth += (p - smooth) * 0.16
      // Reveal the mission layer once the hand is mostly closed.
      scene.classList.toggle('revealed', smooth > 0.55)
      const end = Math.min(SCRUB_END, duration - 0.05)
      const t = Math.min(end, Math.max(0, smooth * end))
      if (Math.abs(t - lastSet) >= FRAME && !video.seeking) {
        video.currentTime = t
        lastSet = t
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onMeta)
    }
  }, [])

  useFadeUp()

  return (
    <>
      <div ref={sceneRef} className="relative" style={{ height: '240vh' }}>
        <section
          ref={stickyRef}
          className="sticky top-0 w-full overflow-hidden h-screen bg-black"
          style={{ height: '100dvh' }}
        >
          <div ref={coverRef} className="hero-cover" aria-hidden="true">
            <img
              ref={humanRef}
              src={handHuman}
              alt=""
              draggable={false}
              className="hero-hand"
              style={{ left: 0, width: `${(900 / IMG_W) * 100}%` }}
            />
            <img
              ref={robotRef}
              src={handRobot}
              alt=""
              draggable={false}
              className="hero-hand"
              style={{ left: `${(800 / IMG_W) * 100}%`, width: `${(884 / IMG_W) * 100}%` }}
            />

            <div className="hero-spinner-wrap">
              <svg className="hero-spinner" viewBox="0 0 100 100" fill="none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="9"
                    x2="50"
                    y2="27"
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity={(i + 1) / 12}
                    transform={`rotate(${i * 30} 50 50)`}
                  />
                ))}
              </svg>
            </div>

            <div className="hero-glow" />
          </div>

          <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
            <h1 className="text-white leading-[0.95]">
              <span
                className="block font-playfair italic font-normal text-4xl min-[400px]:text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
                style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
              >
                Agile hands shape
              </span>
              <span
                className="block font-normal text-4xl min-[400px]:text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
                style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
              >
                what comes next
              </span>
            </h1>
          </div>

          <div
            className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
            style={{ animationDelay: '0.7s' }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              Every Agile Hand is built to move the way you do — fluid, precise,
              and human at heart, engineered joint by joint for real-world work.
            </p>
          </div>

          <div
            className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
            style={{ animationDelay: '0.85s' }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              From assembly lines to operating rooms, our adaptive robotic hands
              learn your craft and work beside you with care and precision.
            </p>
            <a
              href="#demo"
              className="bg-[#e8702a] text-white text-sm font-medium px-7 py-3 rounded-full pointer-events-auto"
            >
              Meet the Hand
            </a>
          </div>
        </section>
      </div>

      <div ref={videoSceneRef} className="relative" style={{ height: '250vh' }}>
        <section
          className="sticky top-0 bg-black overflow-hidden h-screen"
          style={{ height: '100dvh' }}
        >
          {dexterousHandVideo && (
            <video
              ref={videoRef}
              src={dexterousHandVideo}
              muted
              playsInline
              preload="auto"
              className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-[.55] md:opacity-100 md:w-[62%]"
            />
          )}

          <div className="relative z-10 flex h-full items-center">
            <div className="w-full px-6 sm:px-10 md:px-0 md:w-1/2 md:flex md:justify-center">
              <div className="max-w-md md:max-w-[32vw] 2xl:max-w-lg">
                <h2 className="fade-up text-4xl sm:text-6xl leading-[1.05] tracking-[-0.04em] text-white">
                  The <span className="font-playfair italic">dexterous</span> hand
                </h2>
                <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
                  Engineered to move, grip, and adapt with the precision of human
                  touch.
                </p>

                <div className="mission-layer mt-10 border-t border-white/10 pt-8">
                  <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
                    Who We Are
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
                    Founded in 2019 by roboticists from Berkeley and ETH Zürich,
                    Agile Hand exists to give machines the human touch. Today
                    more than 12,000 of our hands work in factories, labs, and
                    operating rooms across 30 countries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="relative bg-black overflow-hidden">
        {touchVideo && (
          <video
            src={touchVideo}
            autoPlay
            muted
            loop
            playsInline
            className="touch-video absolute inset-y-0 left-0 h-full w-full md:w-[52%] object-cover"
          />
        )}

        <div
          className="relative z-10 flex min-h-screen items-center justify-end"
          style={{ minHeight: '100dvh' }}
        >
          <div className="w-full px-6 sm:px-10 md:px-0 py-24 flex md:w-1/2 md:ml-auto md:justify-center">
            <div className="max-w-md md:max-w-[40vw] 2xl:max-w-lg">
              <h2 className="fade-up text-4xl sm:text-6xl leading-[1.05] tracking-[-0.04em] text-white">
                Touch that <span className="font-playfair italic">resonates</span>
              </h2>
              <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
                Force-sensitive fingertips read texture, pressure, and intent —
                every contact measured to the micron, every motion felt.
              </p>

              <div className="mt-12">
                {[
                  {
                    num: '01',
                    name: 'AH-1 Dexterous Hand',
                    text: 'Our flagship 27-DoF hand, drop-in ready for any collaborative robot arm.',
                  },
                  {
                    num: '02',
                    name: 'Tactile Fingertips',
                    text: 'Retrofit sensor pads that give any gripper a true sense of touch.',
                  },
                  {
                    num: '03',
                    name: 'Grasp Control SDK',
                    text: 'Real-time grasp planning and force control — integrated in minutes.',
                  },
                ].map(({ num, name, text }) => (
                  <a
                    key={num}
                    href="#demo"
                    className="fade-up group flex items-baseline gap-4 border-t border-white/10 py-5"
                  >
                    <span className="text-xs text-[#e8702a] font-semibold">{num}</span>
                    <span className="flex-1">
                      <span className="block text-white font-semibold text-base sm:text-lg group-hover:text-[#e8702a] transition-colors">
                        {name}
                      </span>
                      <span className="mt-1 block text-sm text-gray-400 leading-relaxed">
                        {text}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClosingSection />
    </>
  )
}
