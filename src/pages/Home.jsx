import WeddingInvitation from '../assets/image/weeding_invitatio.jpg'
import { useEffect, useState } from 'react'

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const civilWeddingDate = new Date('2025-11-27T10:00:00')
    const timer = setInterval(() => {
      const now = Date.now()
      const distance = civilWeddingDate.getTime() - now
      const days = Math.floor(distance / 86400000)
      const hours = Math.floor((distance % 86400000) / 3600000)
      const minutes = Math.floor((distance % 3600000) / 60000)
      const seconds = Math.floor((distance % 60000) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-pink-100/50" />
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mb-6">
          We're Getting
          <span className="block bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Married!</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">Join us as we celebrate our love story</p>
        <img src={WeddingInvitation} alt="Wedding Invitation" className="mx-auto rounded-lg shadow-2xl max-w-md w-full mb-8" />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-4">Countdown to Civil Wedding</h3>
          <div className="flex justify-center gap-6">
            {Object.entries(timeLeft).map(([k,v]) => (
              <div key={k} className="text-center">
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-lg p-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{v ?? 0}</div>
                </div>
                <div className="text-sm text-gray-600 mt-2 capitalize">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home


