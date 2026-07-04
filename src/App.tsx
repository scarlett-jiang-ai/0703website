import { Menu } from 'lucide-react'

const NAV_LINKS = ['Field Guides', 'Geology', 'Plans', 'Live Tour']

function App() {
  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
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
          <span className="text-white text-2xl font-playfair italic">Lithos</span>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <button className="text-white px-4 py-1.5 rounded-full text-sm font-medium">
            Course
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
          Sign Up
        </button>

        <button className="md:hidden text-white p-2" aria-label="Open menu">
          <Menu size={24} />
        </button>
      </nav>

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              tales of time
            </span>
          </h1>
        </div>

        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient
            seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones,
            fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <button className="bg-[#e8702a] text-white text-sm font-medium px-7 py-3 rounded-full">
            Start Digging
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
