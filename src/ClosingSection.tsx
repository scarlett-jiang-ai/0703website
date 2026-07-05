export default function ClosingSection() {
  return (
    <section id="demo" className="relative bg-black px-6 sm:px-10 md:px-14 pt-24 sm:pt-36 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <p className="fade-up text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
            Get Started
          </p>
          <h2 className="fade-up mt-6 text-4xl sm:text-6xl leading-[1.05] tracking-[-0.04em] text-white">
            Put the future in{' '}
            <span className="font-playfair italic">good hands</span>
          </h2>
          <p className="fade-up mt-8 max-w-xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            See the AH-1 dexterous hand at work in your own facility — live,
            hands-on, and tailored to your line.
          </p>
          <div className="fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:demo@agilehand.com?subject=Demo%20request"
              className="bg-[#e8702a] text-white text-sm font-medium px-8 py-3.5 rounded-full"
            >
              Request a Demo
            </a>
            <a
              href="mailto:sales@agilehand.com"
              className="border border-white/30 text-white text-sm font-medium px-8 py-3.5 rounded-full"
            >
              Talk to Sales
            </a>
          </div>
        </div>

        <div className="fade-up mt-20 sm:mt-28 rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">
              Flagship Product
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl text-white tracking-[-0.03em]">
              AH-1 <span className="font-playfair italic">Dexterous Hand</span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
              Twenty-seven degrees of freedom, 40 N adaptive grip, and
              sub-millinewton tactile sensing — drop-in ready for any
              collaborative robot arm.
            </p>
          </div>
          <a
            href="mailto:sales@agilehand.com?subject=AH-1%20inquiry"
            className="shrink-0 self-start md:self-center border border-white/30 text-white text-sm font-medium px-7 py-3 rounded-full"
          >
            Explore the AH-1
          </a>
        </div>

        <footer className="mt-20 sm:mt-28 border-t border-white/10 pt-12 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span className="text-white text-lg font-playfair italic">
                Agile Hand
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Robotic dexterous hands with the precision of human touch.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Products</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><a href="#demo">AH-1 Dexterous Hand</a></li>
              <li><a href="#demo">Tactile Fingertips</a></li>
              <li><a href="#demo">Grasp Control SDK</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li><a href="#">About</a></li>
              <li><a href="#">Research</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:hello@agilehand.com">hello@agilehand.com</a>
              </li>
              <li>
                <a href="tel:+14155550137">+1 (415) 555-0137</a>
              </li>
              <li className="leading-relaxed">
                660 Mission Street
                <br />
                San Francisco, CA 94105
              </li>
            </ul>
          </div>
        </footer>

        <div className="mt-12 border-t border-white/10 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 Agile Hand, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </section>
  )
}
