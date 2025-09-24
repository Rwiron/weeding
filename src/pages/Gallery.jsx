import { useMemo, useState } from 'react'

const useGallery = () => {
  const allImages = useMemo(() => {
    const modules = import.meta.glob('../assets/image/**/*.{jpg,JPG,png}', { eager: true })
    const entries = Object.entries(modules).map(([path, mod]) => ({ path, src: mod.default }))
    const groupBy = (pred) => entries.filter(({ path }) => pred(path)).map(({ src }) => src)
    return {
      'Our Journey (2017-2023)': groupBy((p) => p.includes('/2017_2023/') && !p.includes('/birthday/')),
      'Birthday Celebrations': groupBy((p) => p.includes('/2017_2023/birthday/')),
      'The Proposal (2025)': groupBy((p) => p.includes('/2025/proposal/')),
      'At Church': groupBy((p) => p.includes('/2025/at_church/')),
      'With Family': groupBy((p) => p.includes('/2025/with family/')),
    }
  }, [])
  return allImages
}

const Gallery = () => {
  const collections = useGallery()
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const categories = ['all', ...Object.keys(collections)]

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return Object.values(collections).flat()
    return collections[activeCategory] || []
  }, [activeCategory, collections])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Our Gallery</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mb-8" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Capturing precious moments from our journey together</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Photos' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((src, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => setSelectedImage(src)}>
              <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-full">
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-full rounded-lg" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 grid place-content-center">✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Gallery


