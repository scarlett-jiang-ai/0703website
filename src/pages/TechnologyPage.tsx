import { useEffect } from 'react'
import handRobot from '../../Picture/hand-robot.png'
import ClosingSection from '../ClosingSection'
import { useFadeUp } from '../useFadeUp'

const ACTUATION_STATS = [
  { value: '27', unit: 'DoF', text: 'degrees of freedom' },
  { value: '40', unit: 'N', text: 'adaptive grip force' },
  { value: '9', unit: 'ms', text: 'reflex latency' },
]

const SENSING_STATS = [
  {
    value: '512',
    label: 'taxels per fingertip',
    text: 'A dense tactile array covers every contact surface, mapping pressure the way skin does.',
  },
  {
    value: '0.2 mN',
    label: 'force resolution',
    text: 'Sensitive enough to feel a strand of hair — or the first hint of a glass beginning to slip.',
  },
  {
    value: '2 kHz',
    label: 'tactile sampling',
    text: 'Touch is read faster than human nerves conduct, so the grip corrects before you could blink.',
  },
]

const LEARNING_STEPS = [
  {
    num: '01',
    name: 'Watch',
    text: 'Imitation learning distills thousands of hours of human demonstration into fluent motor skills.',
  },
  {
    num: '02',
    name: 'Practice',
    text: 'Reinforcement learning hardens every skill across millions of simulated grasps before it ever touches your parts.',
  },
  {
    num: '03',
    name: 'Perform',
    text: 'On-board inference closes the loop at 1 kHz, continuously self-calibrating against wear, friction, and drift.',
  },
]

export default function TechnologyPage() {
  useEffect(() => {
    document.title = 'Technology — Agile Hand'
  }, [])
  useFadeUp()

  return (
    <>
      {/* Page intro */}
      <section className="relative bg-black px-6 sm:px-10 md:px-14 pt-36 sm:pt-48 pb-10 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="fade-up text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
            Technology
          </p>
          <h1 className="fade-up mt-6 text-4xl min-[400px]:text-5xl sm:text-7xl leading-[1.02] tracking-[-0.04em] text-white">
            Anatomy of{' '}
            <span className="font-playfair italic">the perfect grip</span>
          </h1>
          <p className="fade-up mt-8 max-w-xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            Three systems working as one — muscle, sense, and mind — engineered
            to bring human dexterity to machines.
          </p>
        </div>
      </section>

      {/* 01 — Actuation */}
      <section className="relative bg-black px-6 sm:px-10 md:px-14 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-16 items-center">
          <div>
            <p className="fade-up text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
              01 · Actuation
            </p>
            <h2 className="fade-up mt-5 text-3xl sm:text-5xl leading-[1.05] tracking-[-0.04em] text-white">
              Muscles of steel,{' '}
              <span className="font-playfair italic">tendons of silk</span>
            </h2>
            <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
              Twenty micro-actuators drive antagonistic tendon pairs through
              every finger — the same architecture your own hand uses.
              Proprioceptive compliance control senses load through the tendons
              themselves, so the hand yields when the world pushes back and
              holds firm when it matters.
            </p>
            <div className="fade-up mt-10 grid grid-cols-3 border-t border-white/10 pt-8 gap-4">
              {ACTUATION_STATS.map(({ value, unit, text }) => (
                <div key={unit}>
                  <p className="text-3xl sm:text-4xl text-white tracking-[-0.03em]">
                    {value}
                    <span className="text-lg sm:text-xl text-gray-400 ml-1">{unit}</span>
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up relative">
            <img
              src={handRobot}
              alt="The AH-1 robotic hand"
              draggable={false}
              className="w-full max-w-sm sm:max-w-md mx-auto select-none"
              style={{
                filter: 'drop-shadow(0 0 60px rgba(229,229,229,0.12))',
              }}
            />
          </div>
        </div>
      </section>

      {/* 02 — Tactile sensing */}
      <section className="relative bg-black px-6 sm:px-10 md:px-14 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="fade-up text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
              02 · Tactile Sensing
            </p>
            <h2 className="fade-up mt-5 text-3xl sm:text-5xl leading-[1.05] tracking-[-0.04em] text-white">
              Skin that <span className="font-playfair italic">feels</span>
            </h2>
            <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
              On-board models turn raw touch into meaning — detecting slip
              before it happens, recognizing texture, inferring stiffness — so
              the grip adapts in the time it takes a glass to begin to slide.
            </p>
          </div>
          <div className="mt-14 sm:mt-20 grid gap-6 md:grid-cols-3">
            {SENSING_STATS.map(({ value, label, text }) => (
              <div
                key={label}
                className="fade-up rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 transition-colors duration-300 hover:border-white/25"
              >
                <p className="text-4xl sm:text-5xl text-white tracking-[-0.03em]">
                  <span className="font-playfair italic">{value}</span>
                </p>
                <p className="mt-3 text-sm font-semibold text-[#e8702a] uppercase tracking-[0.14em]">
                  {label}
                </p>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Learning & control */}
      <section className="relative bg-black px-6 sm:px-10 md:px-14 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-16 items-center">
          <div className="md:order-2">
            <p className="fade-up text-xs font-semibold tracking-[0.22em] uppercase text-[#e8702a]">
              03 · Learning &amp; Control
            </p>
            <h2 className="fade-up mt-5 text-3xl sm:text-5xl leading-[1.05] tracking-[-0.04em] text-white">
              Hands that <span className="font-playfair italic">learn</span>
            </h2>
            <p className="fade-up mt-6 text-base sm:text-lg text-gray-400 leading-relaxed">
              Every Agile Hand arrives fluent and keeps improving. Skills learned
              by one hand are refined in simulation and shared across the whole
              fleet — so the ten-thousandth unit is better than the first, and
              yours gets better every week.
            </p>
          </div>
          <div className="md:order-1">
            {LEARNING_STEPS.map(({ num, name, text }) => (
              <div
                key={num}
                className="fade-up flex items-baseline gap-4 border-t border-white/10 py-6"
              >
                <span className="text-xs text-[#e8702a] font-semibold">{num}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg sm:text-xl">
                    <span className="font-playfair italic">{name}</span>
                  </p>
                  <p className="mt-2 text-sm sm:text-base text-gray-400 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingSection />
    </>
  )
}
