import QRCode from '../assets/image/qr_code.png'

const RSVP = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Join Our Celebration</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mb-8" />
        <p className="text-xl text-gray-600 mb-8">Your presence would make our special day even more meaningful.</p>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Scan QR Code to RSVP</h3>
          <div className="flex justify-center mb-6">
            <img src={QRCode} alt="RSVP QR Code" className="w-48 h-48 rounded-lg shadow-md" />
          </div>
          <p className="text-gray-600">Scan the QR code above with your phone camera to RSVP and get more details.</p>
        </div>
      </div>
    </section>
  )
}

export default RSVP


