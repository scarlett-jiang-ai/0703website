import { useEffect } from 'react'

// Staggered reveal for .fade-up elements; call once per page component.
export function useFadeUp() {
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
}
