import React from 'react'
import { contentData } from '../constants'

export default function HeroClean() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-6">
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{contentData.hero.headline}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">{contentData.hero.subheadline}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('vision')}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                {contentData.hero.cta1}
              </button>

              <button
                onClick={() => scrollToSection('impact')}
                className="border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400/10 transition-all"
              >
                {contentData.hero.cta2}
              </button>
            </div>
          </div>

          <div className="relative h-96 hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-b from-blue-400 to-transparent opacity-30" />

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <circle cx="50%" cy="14%" r="6" fill="#7dd3fc" />
                  <circle cx="84%" cy="70%" r="5" fill="#60a5fa" />
                  <circle cx="18%" cy="68%" r="4" fill="#22d3ee" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
