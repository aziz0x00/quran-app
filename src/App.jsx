import { useState, useCallback, useEffect, useRef } from 'react'
import { Document, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './index.css'

import FloatingControls from './components/FloatingControls'
import DoublePageView from './components/DoublePageView'
import SinglePageView from './components/SinglePageView'
import LoadingState from './components/LoadingState'
import SurahSearchModal from './components/SurahSearchModal'

// Configure PDF.js worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const PDF_FILE = '/warsh39-1.pdf'

// Error Component
function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="text-[#c62828] text-lg">{error}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[#f0ede5] text-[#5c5344] rounded-lg hover:bg-[#e8e4da] transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  )
}

// Main App Component
function App() {
  const [numPages, setNumPages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Load persisted state from localStorage
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quran-viewMode') || 'double'
    }
    return 'double'
  })
  
  const [pageNumber, setPageNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran-pageNumber')
      return saved ? parseInt(saved, 10) : 1
    }
    return 1
  })
  
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran-zoom')
      return saved ? parseFloat(saved) : 1
    }
    return 1
  })
  
  const [controlsVisible, setControlsVisible] = useState(true)

  const singlePageRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const mainRef = useRef(null)

  // Calculate scale based on viewport
  const calculateScale = useCallback(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let baseScale
    if (viewMode === 'single') {
      const padding = 40
      const availableWidth = viewportWidth - padding
      baseScale = availableWidth / 600
      baseScale = Math.max(0.5, Math.min(baseScale, 2.5))
    } else {
      baseScale = viewportHeight / 550
      baseScale = Math.max(0.6, Math.min(baseScale, 2.5))
    }

    return baseScale * zoom
  }, [viewMode, zoom])

  const [scale, setScale] = useState(1)

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('quran-viewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('quran-pageNumber', pageNumber.toString())
  }, [pageNumber])

  useEffect(() => {
    localStorage.setItem('quran-zoom', zoom.toString())
  }, [zoom])

  // Focus main content when search closes
  useEffect(() => {
    if (!searchOpen) {
      // Small delay to ensure modal is closed
      requestAnimationFrame(() => {
        document.activeElement?.blur()
        window.focus()
      })
    }
  }, [searchOpen])

  // Scroll helper
  const scrollToTop = useCallback(() => {
    if (viewMode === 'single' && singlePageRef.current) {
      singlePageRef.current.scrollToTop()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [viewMode])

  // Page navigation
  const goToPrevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - (viewMode === 'double' ? 2 : 1), 1))
  }, [viewMode])

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + (viewMode === 'double' ? 2 : 1), numPages || 1))
  }, [viewMode, numPages])

  const goToFirstPage = useCallback(() => {
    setPageNumber(1)
    scrollToTop()
  }, [scrollToTop])

  const goToLastPage = useCallback(() => {
    const last = numPages || 1
    setPageNumber(viewMode === 'double' ? last - 1 : last)
    scrollToTop()
  }, [viewMode, numPages, scrollToTop])

  // Update scale on resize
  useEffect(() => {
    const updateScale = () => setScale(calculateScale())
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [calculateScale])

  // Show controls on mouse move, hide after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true)
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false)
      }, 2000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    // Initial hide timer
    hideTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false)
    }, 2000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
    // Validate saved page number is within bounds
    const savedPage = parseInt(localStorage.getItem('quran-pageNumber') || '1', 10)
    if (savedPage > numPages) {
      setPageNumber(1)
    }
  }, [])

  const onDocumentLoadError = useCallback((err) => {
    console.error('PDF load error:', err)
    setError('فشل تحميل الملف')
    setLoading(false)
  }, [])

  const handlePageInput = (e) => {
    const val = parseInt(e.target.value)
    if (val >= 1 && val <= numPages) {
      setPageNumber(val)
      scrollToTop()
    }
  }

  const toggleViewMode = useCallback(() => {
    const willBeSingle = viewMode === 'double'
    setViewMode((prev) => (prev === 'double' ? 'single' : 'double'))
    scrollToTop()
    if (willBeSingle) {
      setTimeout(() => singlePageRef.current?.focus(), 100)
    }
  }, [scrollToTop, viewMode])

  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.25, 0.5))
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
  }

  // Smooth scroll for single-page mode
  const scrollBy = useCallback((amount) => {
    if (singlePageRef.current) {
      singlePageRef.current.scrollBy({
        top: amount,
        behavior: 'smooth'
      })
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if focused on form elements
      const tag = e.target.tagName.toLowerCase()
      if (tag === 'input' || tag === 'button' || tag === 'select' || e.target.isContentEditable) return

      const key = e.key
      const scrollAmount = 300

      switch (key) {
        case 'j':
          // j / arrowdown = scroll down
          if (viewMode === 'single') scrollBy(scrollAmount)
          else goToNextPage()
          break
        case 'k':
          // k / arrowup = scroll up
          if (viewMode === 'single') scrollBy(-scrollAmount)
          else goToPrevPage()
          break
        case 'h':
        case 'ArrowLeft':
          // h + arrowleft = next in RTL
          goToNextPage()
          break
        case 'l':
        case 'ArrowRight':
          // l + arrowright = previous in RTL
          goToPrevPage()
          break
        case 'g':
          goToFirstPage()
          break
        case 'G':
          goToLastPage()
          break
        case ' ':
          e.preventDefault()
          goToNextPage()
          break
        case 'Tab':
          e.preventDefault()
          toggleViewMode()
          break
        case '=':
          // = (no shift) = reset zoom
          setZoom(1)
          break
        case '+':
          // + (with shift) = zoom in
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case 'p':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setSearchOpen(true)
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextPage, goToPrevPage, goToFirstPage, goToLastPage, toggleViewMode, scrollBy, viewMode])

  return (
    <div className="min-h-screen">
      {/* Floating Controls */}
      <FloatingControls
        pageNumber={pageNumber}
        numPages={numPages}
        viewMode={viewMode}
        zoom={zoom}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onFirstPage={goToFirstPage}
        onLastPage={goToLastPage}
        onPageInput={handlePageInput}
        onToggleViewMode={toggleViewMode}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        visible={controlsVisible}
      />

      {/* Surah Search Modal */}
      <SurahSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onGoToPage={(page) => {
          setPageNumber(page)
          scrollToTop()
        }}
      />

      {/* Main Content */}
      <main ref={mainRef}>
        {error && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        <Document
          file={PDF_FILE}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingState />}
        >
          {loading ? (
            <LoadingState />
          ) : viewMode === 'double' ? (
            <DoublePageView
              pageNumber={pageNumber}
              numPages={numPages}
              scale={scale}
            />
          ) : (
            <SinglePageView
              ref={singlePageRef}
              pageNumber={pageNumber}
              numPages={numPages}
              scale={scale}
              onPageChange={setPageNumber}
            />
          )}
        </Document>
      </main>
    </div>
  )
}

export default App
