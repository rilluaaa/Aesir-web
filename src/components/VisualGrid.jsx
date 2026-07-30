import React from 'react'

export default function VisualGrid() {
  const imagePath = (fileName) => `${import.meta.env.BASE_URL}assets/images/${fileName}?v=2`

  const images = [
    { src: imagePath('photo-1.jpg'), label: 'NEURO portrait' },
    { src: imagePath('photo-2.jpg'), label: 'Handshake' },
    { src: imagePath('photo-3.jpg'), label: 'Team discussion' },
    { src: imagePath('photo-4.jpg'), label: 'Group planning' },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div className="scroll-slice overflow-hidden bg-white">
        <div className="relative h-56 w-full md:h-[360px]">
          <img
            src={images[0].src}
            alt={images[0].label}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      <div className="scroll-slice overflow-hidden bg-white">
        <div className="relative flex h-56 w-full md:h-[360px]">
          <div className="w-1/2 h-full overflow-hidden">
            <img
              src={images[1].src}
              alt={images[1].label}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid h-full w-1/2 grid-rows-2 gap-2 pl-2">
            <div className="overflow-hidden">
              <img
                src={images[2].src}
                alt={images[2].label}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <img
                src={images[3].src}
                alt={images[3].label}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
