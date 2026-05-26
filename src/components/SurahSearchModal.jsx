import { useState, useEffect, useRef } from 'react'

function SurahSearchModal({ isOpen, onClose, onGoToPage }) {
  const [query, setQuery] = useState('')
  const [surahs, setSurahs] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Filtered surahs
  const filtered = query.trim()
    ? surahs.filter(s => 
        s.name.includes(query) || 
        s.english.toLowerCase().includes(query.toLowerCase()) ||
        s.num.toString() === query
      )
    : surahs

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
        setQuery('')
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Load CSV data
  useEffect(() => {
    fetch('/toc.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split('\n')
        const data = lines.slice(1).map(line => {
          const [num, name, english, , page] = line.split(',')
          return { num: parseInt(num), name, english, page: parseInt(page) }
        })
        setSurahs(data)
      })
  }, [])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view when it changes
  useEffect(() => {
    if (!isOpen || filtered.length === 0 || !listRef.current) return
    
    const container = listRef.current
    const children = container.children
    const selectedEl = children[selectedIndex]
    
    if (!selectedEl) return
    
    // Use scrollIntoView with block: 'nearest' to bring item into view
    // without centering it - scrolls minimally needed
    selectedEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
  }, [selectedIndex, isOpen, filtered.length])

  const handleSelect = (surah) => {
    onGoToPage(surah.page)
    onClose()
    setQuery('')
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (filtered.length === 0) return
    
    let newIndex = selectedIndex
    
    if (e.key === 'Tab') {
      e.preventDefault()
    }
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault()
      newIndex = (selectedIndex + 1) % filtered.length
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault()
      newIndex = (selectedIndex - 1 + filtered.length) % filtered.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(filtered[selectedIndex])
      return
    }

    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex)
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-start justify-center pt-[12vh] animate-fade-out ${isOpen ? 'animate-fade-in' : ''}`}
      onClick={onClose}
      style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30"
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
      />
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-xl bg-[#faf8f3] rounded-2xl shadow-2xl border border-[rgba(139,105,20,0.15)] overflow-hidden mx-4"
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)', transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header with search */}
        <div className="p-4 border-b border-[rgba(139,105,20,0.1)]">
          <div className="relative">
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a8275]" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="ابحث عن سورة..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-12 py-3 text-lg bg-[#f0ede5] border-none rounded-xl text-[#2c2416] placeholder-[#8a8275] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30"
            />
          </div>
        </div>

        {/* Results */}
        <div 
          ref={listRef}
          className="max-h-[45vh] overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#8a8275]">لا توجد سورة</div>
          ) : (
            <div className="p-2">
              {filtered.map((surah, idx) => (
                <button
                  key={surah.num}
                  onClick={() => handleSelect(surah)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-right rounded-xl transition-all ${
                    idx === selectedIndex 
                      ? 'bg-[#8b6914] text-white shadow-lg' 
                      : 'hover:bg-[#f0ede5]'
                  }`}
                >
                  <span 
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg ${
                      idx === selectedIndex 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#f0ede5] text-[#8b6914]'
                    }`}
                  >
                    {surah.num}
                  </span>
                  <div className="flex-1">
                    <div className="font-arabic text-lg">{surah.name.replace(/^سُورَةُ /, '')}</div>
                    <div className={`text-xs ${idx === selectedIndex ? 'text-white/70' : 'text-[#8a8275]'}`}>
                      {surah.english}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-lg ${
                    idx === selectedIndex 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#f0ede5] text-[#8a8275]'
                  }`}>
                    صفحة {surah.page}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[rgba(139,105,20,0.1)] flex items-center justify-between text-[10px] text-[#8a8275]">
          <div className="flex items-center gap-2">
            <kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">↑</kbd>
            <kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">↓</kbd>
            <kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">Tab</kbd>
            <span>تحريك</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">Enter</kbd>
            <span>للذهاب</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">Esc</kbd>
            <span>للإغلاق</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurahSearchModal
