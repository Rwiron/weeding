const Events = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Wedding Events</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
              <h3 className="text-2xl font-serif font-bold text-white">Civil Wedding</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700"><span className="font-semibold">Date:</span> November 27, 2025</p>
              <p className="text-gray-700"><span className="font-semibold">Venue:</span> Civil Wedding Nyarugenge District Headquarters</p>
              <p className="text-gray-700"><span className="font-semibold">Time:</span> 10:00 AM</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
              <h3 className="text-2xl font-serif font-bold text-white">Wedding Celebration</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700"><span className="font-semibold">Date:</span> December 13, 2025</p>
              <p className="text-gray-700"><span className="font-semibold">Venue:</span> Alegria Inn</p>
              <p className="text-gray-700"><span className="font-semibold">Time:</span> 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events


