function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="font-arabic text-7xl text-[#8b6914] animate-pulse-slow">القرآن الكريم</div>
      <div className="text-[#5c5344] text-sm tracking-widest">جاري التحميل...</div>
    </div>
  )
}

export default LoadingState
