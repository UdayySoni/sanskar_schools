import { useEffect, useRef, useState } from "react"

export default function useInView<T extends HTMLElement>(rootMargin = "0px", once = false) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!("IntersectionObserver" in window)) { setInView(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      if (entry.isIntersecting && once) observer.disconnect()
    }, { rootMargin })
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, once])
  return { ref, inView }
}
