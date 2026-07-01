import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

interface Slide {
  id: number
  title: string
  content: string
}

// Placeholder slides - будут заменены на реальные данные из Figma
const SLIDES: Slide[] = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  title: `Slide ${i + 1}`,
  content: `Content for slide ${i + 1}`
}))

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () => {
    setCurrentSlide(prev => prev === 0 ? SLIDES.length - 1 : prev - 1)
  }

  const handleNext = () => {
    setCurrentSlide(prev => prev === SLIDES.length - 1 ? 0 : prev + 1)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) handleNext()
    else handlePrev()
  }

  const slide = SLIDES[currentSlide]

  return (
    <div className="presentation-container" onWheel={handleWheel}>
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-left">
          <h1>RAISE LLC</h1>
        </div>
        <div className="nav-center">
          <span>{currentSlide + 1} / {SLIDES.length}</span>
        </div>
        <div className="nav-right">
          <button onClick={handlePrev} className="nav-btn">←</button>
          <button onClick={handleNext} className="nav-btn">→</button>
        </div>
      </nav>

      {/* Main Slide */}
      <motion.div
        className="slide"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <div className="slide-content">
          <h2>{slide.title}</h2>
          <p>{slide.content}</p>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  )
}
