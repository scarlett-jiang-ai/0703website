import { useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import handHuman from '../Picture/hand-human.png'
import handRobot from '../Picture/hand-robot.png'

const NAV_LINKS = ['Technology', 'Products', 'Research', 'Contact']

// Resolved lazily via glob so the build succeeds even before the video
// file is pushed to the repo; once Video/0704dexterous-hand.mp4 exists it
// is bundled and picked up automatically.
const videoAssets = import.meta.glob('../Video/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const dexterousHandVideo =
  videoAssets['../Video/0704dexterous-hand.mp4'] ?? Object.values(videoAssets)[0]

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

function App() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const humanRef = useRef<HTMLImageElement>(null)
  const robotRef = useRef<HTMLImageElement>(null)

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

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.fade-up')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 90}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div
      className="min-h-screen bg-black tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 256 256"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic">Agile Hand</span>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <button className="text-white px-4 py-1.5 rounded-full text-sm font-medium">
            Overview
          </button>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium"
            >
              {link}
            </button>
          ))}
        </div>

        <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full">
          Request a Demo
        </button>

        <button className="md:hidden text-white p-2" aria-label="Open menu">
          <Menu size={24} />
        </button>
      </nav>

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
                className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
                style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
              >
                Agile hands shape
              </span>
              <span
                className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
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
            <button className="bg-[#e8702a] text-white text-sm font-medium px-7 py-3 rounded-full">
              Meet the Hand
            </button>
          </div>
        </section>
      </div>

      <section
        className="relative bg-black overflow-hidden h-screen"
        style={{ height: '100dvh' }}
      >
        {dexterousHandVideo && (
          <video
            src={dexterousHandVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
        )}

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-6 sm:px-10 md:px-14">
            <div className="max-w-md lg:max-w-lg">
              <h2 className="fade-up text-4xl sm:text-6xl leading-[1.05] tracking-[-0.04em] text-white">
                The <span className="font-playfair italic">dexterous</span> hand
              </h2>
              <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
                Engineered to move, grip, and adapt with the precision of human
                touch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
