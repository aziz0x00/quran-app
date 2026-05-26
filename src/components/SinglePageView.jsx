import { useCallback, useMemo, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Page } from 'react-pdf'

const SinglePageView = forwardRef(function SinglePageView({ pageNumber, numPages, scale, onPageChange }, ref) {
  const containerRef = useRef(null)
  const isKeyboardScrolling = useRef(false)

  // Focus container for keyboard scrolling
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  // Expose scroll methods and focus to parent
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (containerRef.current) {
        isKeyboardScrolling.current = true
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { isKeyboardScrolling.current = false }, 500)
      }
    },
    scrollBy: (options) => {
      if (containerRef.current) {
        isKeyboardScrolling.current = true
        containerRef.current.scrollBy(options)
        setTimeout(() => { isKeyboardScrolling.current = false }, 500)
      }
    },
    focus: () => {
      containerRef.current?.focus()
    }
  }))

  const preloadPages = useCallback((currentPage) => {
    const pagesToPreload = []
    for (let i = -2; i <= 3; i++) {
      const p = currentPage + i
      if (p >= 1 && p <= (numPages || 1)) {
        pagesToPreload.push(p)
      }
    }
    return pagesToPreload
  }, [numPages])

  const allPages = useMemo(() => preloadPages(pageNumber), [preloadPages, pageNumber])

  // Calculate page width at current scale (Quran page base width is ~600px)
  const pageWidth = 600 * scale

  const handleScroll = useCallback((e) => {
    // Ignore scroll events from keyboard navigation
    if (isKeyboardScrolling.current) return

    const container = e.target
    const children = Array.from(container.querySelectorAll('[data-page]'))
    if (children.length === 0) return

    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    // Find page closest to center
    let closestPage = null
    let closestDistance = Infinity

    for (const child of children) {
      const rect = child.getBoundingClientRect()
      const pageCenter = rect.top + rect.height / 2
      const distance = Math.abs(pageCenter - containerCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestPage = parseInt(child.getAttribute('data-page'))
      }
    }

    // Only update if page changed and within threshold
    if (closestPage && closestPage !== pageNumber && closestDistance < 200) {
      onPageChange(closestPage)
    }
  }, [pageNumber, onPageChange])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto smooth-scroll outline-0"
      tabIndex={0}
      style={{ padding: '20px' }}
      onScroll={handleScroll}
    >
      <div
        className="mx-auto flex flex-col items-center"
        style={{ width: pageWidth, maxWidth: '100%' }}
      >
        {allPages.map((pg) => (
          <div
            key={pg}
            data-page={pg}
            className="flex flex-col items-center mb-8 min-h-[80vh] justify-center"
          >
            <Page
              pageNumber={pg}
              scale={scale}
              className="bg-[#f5f2eb] rounded shadow-xl"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

export default SinglePageView
