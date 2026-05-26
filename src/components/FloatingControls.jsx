function FloatingControls({ 
  pageNumber, 
  numPages, 
  viewMode,
  zoom,
  onPrevPage, 
  onNextPage,
  onFirstPage,
  onLastPage,
  onPageInput,
  onToggleViewMode,
  onZoomIn,
  onZoomOut,
  visible,
}) {
  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 bg-[rgba(250,248,243,0.92)] backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl border border-[rgba(139,105,20,0.1)]">
        {/* View Mode Toggle */}
        <button 
          onClick={onToggleViewMode} 
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 active:scale-90 ${
            viewMode === 'single' 
              ? 'bg-[#8b6914] text-white' 
              : 'bg-[#f0ede5] text-[#5c5344] hover:bg-[#e8e4da]'
          }`}
          title={viewMode === 'double' ? 'Single page' : 'Double page'}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
            {viewMode === 'double' 
              ? <path d="M3 5v14h18V5H3zm16 12H5V7h14v10z"/>
              : <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            }
          </svg>
        </button>

        <div className="w-px h-6 bg-[rgba(139,105,20,0.12)]"></div>

        {/* Zoom (single mode) */}
        {viewMode === 'single' && (
          <>
            <button onClick={onZoomOut} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f0ede5] hover:bg-[#e8e4da] text-[#5c5344] transition-all active:scale-90">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <span className="text-[#5c5344] text-xs font-medium min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={onZoomIn} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f0ede5] hover:bg-[#e8e4da] text-[#5c5344] transition-all active:scale-90">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <div className="w-px h-6 bg-[rgba(139,105,20,0.12)]"></div>
          </>
        )}

        {/* Navigation */}
        <button onClick={onFirstPage} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede5] text-[#5c5344] transition-all active:scale-90" title="First">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6 6l6 6-6 6V6z"/><path d="M18 12l-6 6V6l6 6z"/></svg>
        </button>
        
        <button onClick={onPrevPage} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede5] text-[#5c5344] transition-all active:scale-90" title="Previous">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>
        
        {/* Page Input */}
        <div className="flex items-center gap-1.5 px-1" dir="ltr">
          <input 
            type="number" 
            className="w-11 h-7 bg-[#e8e4da] border-none rounded text-center text-sm font-medium text-[#2c2416] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30 transition-all"
            value={pageNumber}
            onChange={(e) => onPageInput(e)}
            min={1}
            max={numPages}
          />
          <span className="text-[#8a8275] text-xs">/</span>
          <span className="text-[#5c5344] text-sm min-w-[24px]">{numPages || '…'}</span>
        </div>
        
        <button onClick={onNextPage} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede5] text-[#5c5344] transition-all active:scale-90" title="Next">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        
        <button onClick={onLastPage} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede5] text-[#5c5344] transition-all active:scale-90" title="Last">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6 18l6-6-6-6v12zM18 6l-6 6 6 6V6z"/></svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex justify-center gap-3 mt-2 text-[10px] text-[#8a8275]/60" dir="ltr">
        <span><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">h</kbd><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">j</kbd><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">k</kbd><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">l</kbd></span>
        <span><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">g</kbd><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">G</kbd></span>
        <span><kbd className="bg-[#e8e4da] px-1.5 py-0.5 rounded text-[9px]">Ctrl+P</kbd></span>
      </div>
    </div>
  )
}

export default FloatingControls