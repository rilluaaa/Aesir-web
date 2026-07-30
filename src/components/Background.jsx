import React from 'react'

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(103,232,249,0.14),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(255,255,255,0.08),transparent_24rem),linear-gradient(120deg,rgba(255,255,255,0.045),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-10" />
      <div className="absolute right-6 top-0 h-full w-px bg-white/10 md:right-10" />
    </div>
  )
}
