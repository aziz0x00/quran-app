import { useMemo } from 'react'
import { Page } from 'react-pdf'

function DoublePageView({ pageNumber, numPages, scale }) {
  const pages = useMemo(() => {
    // Always show pairs, even on last page
    // If at last page and numPages is odd, show numPages-1 and numPages
    if (pageNumber >= numPages && numPages > 1) {
      return [numPages - 1, numPages]
    }

    const arr = [pageNumber]
    if (pageNumber + 1 <= numPages) {
      arr.push(pageNumber + 1)
    }
    return arr
  }, [pageNumber, numPages])

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center">
      <div className="flex gap-4 items-center">
        {pages.map((pg) => (
          <div
            key={pg}
            className="flex flex-col items-center page-enter relative"
          >
            <Page
              pageNumber={pg}
              scale={scale}
              className="bg-[#f5f2eb] rounded-lg shadow-xl"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoublePageView
