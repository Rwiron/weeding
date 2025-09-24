import { useState, useEffect, useMemo } from 'react'
import WeddingInvitation from './assets/image/weeding_invitatio.jpg'
import QRCode from './assets/image/qr_code.png'
import HeroImage from './assets/image/2025/proposal/10.JPG'
import WeddingVideo from './assets/video/wedding_oreste.mp4'

const useGallery = () => {
  const allImages = useMemo(() => {
    const modules = import.meta.glob('./assets/image/**/*.{jpg,JPG,png}', { eager: true })
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

function App() {
  const [civilTimeLeft, setCivilTimeLeft] = useState({})
  const [marriageTimeLeft, setMarriageTimeLeft] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSection, setActiveSection] = useState('home')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [ussdCode, setUssdCode] = useState('')
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const collections = useGallery()
  const categories = ['all', ...Object.keys(collections)]

  // Phone numbers for donations
  const phoneNumbers = {
    groom: '0788917561', // TUYIZERE Oreste
    bride: '0787665880'  // AKIMANA Nadine
  }

  // Generate USSD code for donation
  const generateUSSD = () => {
    if (selectedRecipient && donationAmount) {
      const phoneNumber = phoneNumbers[selectedRecipient]
      const code = `*182*1*1*${phoneNumber}*${donationAmount}#`
      setUssdCode(code)
    }
  }

  // Copy USSD code to clipboard
  const copyUSSDCode = async () => {
    try {
      await navigator.clipboard.writeText(ussdCode)
      alert('Code copied to clipboard!')
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = ussdCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Code copied to clipboard!')
    }
  }

  // Open dialer with USSD code
  const dialUSSDCode = () => {
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`
  }

  // Download wedding invitation
  const downloadInvitation = () => {
    const link = document.createElement('a')
    link.href = WeddingInvitation
    link.download = 'Oreste_Nadine_Wedding_Invitation.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Countdown timers for both events
  useEffect(() => {
    const civilWeddingDate = new Date('2025-11-27T10:00:00')
    const marriageDate = new Date('2025-12-13T18:00:00')

    const timer = setInterval(() => {
      const now = Date.now()

      // Civil wedding countdown
      const civilDistance = civilWeddingDate.getTime() - now
      const civilDays = Math.floor(civilDistance / 86400000)
      const civilHours = Math.floor((civilDistance % 86400000) / 3600000)
      const civilMinutes = Math.floor((civilDistance % 3600000) / 60000)
      const civilSeconds = Math.floor((civilDistance % 60000) / 1000)
      setCivilTimeLeft({ days: civilDays, hours: civilHours, minutes: civilMinutes, seconds: civilSeconds })

      // Marriage celebration countdown
      const marriageDistance = marriageDate.getTime() - now
      const marriageDays = Math.floor(marriageDistance / 86400000)
      const marriageHours = Math.floor((marriageDistance % 86400000) / 3600000)
      const marriageMinutes = Math.floor((marriageDistance % 3600000) / 60000)
      const marriageSecondsCalc = Math.floor((marriageDistance % 60000) / 1000)
      setMarriageTimeLeft({ days: marriageDays, hours: marriageHours, minutes: marriageMinutes, seconds: marriageSecondsCalc })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return Object.values(collections).flat()
    return collections[activeCategory] || []
  }, [activeCategory, collections])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-2 md:mr-3">
                <span className="text-white font-bold text-lg md:text-xl">💕</span>
              </div>
              <span className="text-lg md:text-2xl font-bold text-gray-800">
                <span className="hidden sm:inline">Oreste & Nadine</span>
                <span className="sm:hidden">O & N</span>
              </span>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-gray-600 hover:text-pink-500 font-medium transition-colors ${activeSection === 'home' ? 'text-pink-500' : ''}`}
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className={`text-gray-600 hover:text-pink-500 font-medium transition-colors ${activeSection === 'events' ? 'text-pink-500' : ''}`}
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className={`text-gray-600 hover:text-pink-500 font-medium transition-colors ${activeSection === 'gallery' ? 'text-pink-500' : ''}`}
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('rsvp')}
                className={`text-gray-600 hover:text-pink-500 font-medium transition-colors ${activeSection === 'rsvp' ? 'text-pink-500' : ''}`}
              >
                Contact
              </button>
            </div>

            {/* Desktop Contact Button */}
            <button
              onClick={() => scrollToSection('rsvp')}
              className="hidden md:block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
            >
              Contact
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-pink-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    scrollToSection('home')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-600 hover:text-pink-500 hover:bg-gray-50 transition-colors font-medium"
                >
                  Our Story
                </button>
                <button
                  onClick={() => {
                    scrollToSection('events')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-600 hover:text-pink-500 hover:bg-gray-50 transition-colors font-medium"
                >
                  Events
                </button>
                <button
                  onClick={() => {
                    scrollToSection('gallery')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-600 hover:text-pink-500 hover:bg-gray-50 transition-colors font-medium"
                >
                  Gallery
                </button>
                <button
                  onClick={() => {
                    scrollToSection('rsvp')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-600 hover:text-pink-500 hover:bg-gray-50 transition-colors font-medium"
                >
                  Contact
                </button>
                <div className="px-4 pt-2">
                  <button
                    onClick={() => {
                      scrollToSection('rsvp')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Responsive Hero Section */}
      <section id="home" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50 relative overflow-hidden pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center w-full py-8">

            {/* Left Content - Responsive */}
            <div className="space-y-8 md:space-y-12 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4 md:mb-6">
                    <div className="w-1 h-12 md:h-16 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                    <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">December 2025</div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight lg:leading-[0.9] tracking-tight">
                    <span className="text-pink-500">Oreste</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-600 mx-2 md:mx-4">&</span>
                    <span className="text-rose-500">Nadine</span>
                    <br />
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 font-light">are getting married</span>
                  </h1>
                </div>

                <div className="max-w-lg mx-auto lg:mx-0">
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                    "Once in a while, right in the middle of an ordinary life, love gives us a fairy tale."
                  </p>

                  {/* Download Invitation Button */}
                  <div className="mt-6">
                    <button
                      onClick={downloadInvitation}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-4 md:px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Download Invitation</span>
                      <span className="sm:hidden">Download</span>
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-center lg:justify-start space-x-4 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-xs md:text-sm text-gray-500">TUYIZERE Oreste</span>
                    </div>
                    <div className="text-gray-300">•</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span className="text-xs md:text-sm text-gray-500">AKIMANA Nadine</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Countdown Timers */}
              <div className="space-y-4 md:space-y-6">
                {/* Civil Wedding Countdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Civil Wedding</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Nov 27</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {Object.entries(civilTimeLeft).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-xl md:rounded-2xl p-2 md:p-3 mb-2 md:mb-3 shadow-lg">
                          <div className="text-lg md:text-2xl font-bold">{value ?? 0}</div>
                        </div>
                        <div className="text-xs text-gray-500 capitalize font-medium">{unit}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marriage Celebration Countdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Wedding Celebration</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Dec 13</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {Object.entries(marriageTimeLeft).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl md:rounded-2xl p-2 md:p-3 mb-2 md:mb-3 shadow-lg">
                          <div className="text-lg md:text-2xl font-bold">{value ?? 0}</div>
                        </div>
                        <div className="text-xs text-gray-500 capitalize font-medium">{unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Image - Responsive Frame */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-white p-1 md:p-2">
                <img
                  src={HeroImage}
                  alt="Oreste & Nadine"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover object-center rounded-xl md:rounded-2xl"
                />

                {/* Elegant frame overlay */}
                <div className="absolute inset-1 md:inset-2 rounded-xl md:rounded-2xl border border-white/20 md:border-2 pointer-events-none"></div>
              </div>

              {/* Decorative elements around frame - responsive */}
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-4 h-4 md:w-8 md:h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-3 h-3 md:w-6 md:h-6 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full opacity-40"></div>
              <div className="absolute top-1/2 -right-3 md:-right-6 w-2 h-2 md:w-4 md:h-4 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-50"></div>

              {/* Play Button Overlay - responsive */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-500 ml-1 group-hover:text-rose-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full opacity-30 -translate-y-24 translate-x-24 md:-translate-y-40 md:translate-x-40 lg:-translate-y-48 lg:translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full opacity-30 translate-y-16 -translate-x-16 md:translate-y-24 md:-translate-x-24 lg:translate-y-32 lg:-translate-x-32"></div>

        {/* Bottom Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* Wedding Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-6 py-3 mb-6">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span className="text-pink-700 font-medium">Wedding Events</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Join Our Celebration
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              TUYIZERE Oreste and AKIMANA Nadine invite you to celebrate their special day
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Civil Wedding */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">⚖️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Civil Wedding</h3>
                  <p className="text-pink-600">Official Ceremony</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600">📅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">November 27, 2025</p>
                    <p className="text-gray-600 text-sm">Thursday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Nyarugenge District</p>
                    <p className="text-gray-600 text-sm">Civil Wedding Headquarters</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600">🕙</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">10:00 AM</p>
                    <p className="text-gray-600 text-sm">Morning Ceremony</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wedding Celebration */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border border-rose-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">🎉</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Wedding Celebration</h3>
                  <p className="text-rose-600">Reception & Party</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600">📅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">December 13, 2025</p>
                    <p className="text-gray-600 text-sm">Saturday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Alegria Inn - RUYENZI</p>
                    <p className="text-gray-600 text-sm">Reception Venue</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600">🕕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">6:00 PM</p>
                    <p className="text-gray-600 text-sm">Evening Celebration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Gallery - Timeline Design */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-6 py-3 mb-6">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span className="text-pink-700 font-medium">Our Journey</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Love Story Timeline
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From our first meeting in 2017 to saying "I do" in 2025 - every moment has been a beautiful chapter in our love story
            </p>
          </div>

          {/* Responsive Journey Timeline */}
          <div className="relative">
            {/* Timeline line - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-200 via-rose-300 to-pink-200 rounded-full"></div>

            {/* Journey Phases */}
            <div className="space-y-16 md:space-y-24 lg:space-y-32">

              {/* 2017-2023: Our Journey - Mobile Optimized */}
              <div className="relative">
                {/* Mobile Timeline Indicator */}
                <div className="lg:hidden flex justify-center mb-6">
                  <div className="w-12 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  <div className="w-full lg:w-1/2 lg:pr-16">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center space-x-2 bg-rose-100 rounded-full px-4 py-2 mb-4">
                        <span className="text-rose-600 text-sm font-medium">2017 - 2023</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Beautiful Beginning</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">
                        It all started in 2017 when destiny brought Oreste and Nadine together. Through years of laughter,
                        adventures, and growing closer, we built the foundation of our forever love.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {collections['Our Journey (2017-2023)']?.slice(0, 6).map((src, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedImage(src)}
                          >
                            <img
                              src={src}
                              alt={`Journey ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Timeline dot - Hidden on mobile */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="w-full lg:w-1/2 lg:pl-16">
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Special Moments</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">First meeting and instant connection</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">Countless adventures together</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">Growing deeper in love</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Birthday Celebrations - Mobile Optimized */}
              <div className="relative">
                {/* Mobile Timeline Indicator */}
                <div className="lg:hidden flex justify-center mb-6">
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  <div className="w-full lg:w-1/2 lg:pr-16">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                        <span className="text-purple-600 text-sm font-medium">Celebrations</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Birthday Joy & Milestones 🎉</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">
                        Every birthday became extra special when celebrated together. These moments of joy,
                        laughter, and celebration marked important milestones in our journey to forever.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {collections['Birthday Celebrations']?.slice(0, 6).map((src, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedImage(src)}
                          >
                            <img
                              src={src}
                              alt={`Birthday ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Timeline dot - Hidden on mobile */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="w-full lg:w-1/2 lg:pl-16">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Celebration Highlights</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">Surprise birthday parties</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">Creating beautiful memories</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm md:text-base">Sharing life's special moments</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Proposal 2025 */}
              <div className="relative">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="text-center lg:text-right">
                      <div className="inline-flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
                        <span className="text-yellow-600 text-sm font-medium">2025</span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">The Perfect Proposal 💍</h3>
                      <p className="text-lg text-gray-600 mb-6">
                        The moment we had both been dreaming of! In 2025, Oreste got down on one knee and asked the most
                        important question. Nadine's "YES!" marked the beginning of our forever journey.
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {collections['The Proposal (2025)']?.slice(0, 6).map((src, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedImage(src)}
                          >
                            <img
                              src={src}
                              alt={`Proposal ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot - special for proposal */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-4 border-white shadow-xl z-10">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs">💍</span>
                    </div>
                  </div>

                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 shadow-xl border-2 border-yellow-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">The Big Moment</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                          <span>The perfect setting chosen</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                          <span>Down on one knee</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                          <span>She said YES! 💕</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Family & Church Blessings */}
              <div className="relative">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
                        <span className="text-blue-600 text-sm font-medium">Family & Faith</span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">Blessed by Family & Faith ⛪</h3>
                      <p className="text-lg text-gray-600 mb-6">
                        With the ring on her finger, we celebrated with our beloved families and sought blessings at church.
                        These precious moments with loved ones made our engagement even more meaningful.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-gray-700 text-center">At Church</h5>
                          {collections['At Church']?.slice(0, 2).map((src, index) => (
                            <div
                              key={index}
                              className="aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                              onClick={() => setSelectedImage(src)}
                            >
                              <img
                                src={src}
                                alt={`Church ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-gray-700 text-center">With Family</h5>
                          {collections['With Family']?.slice(0, 2).map((src, index) => (
                            <div
                              key={index}
                              className="aspect-video overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                              onClick={() => setSelectedImage(src)}
                            >
                              <img
                                src={src}
                                alt={`Family ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Sharing the Joy</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>Church blessings</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                          <span>Family celebrations</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>Surrounded by love</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* View All Photos Button */}
          <div className="text-center mt-20">
            <button
              onClick={() => {
                setActiveCategory('all')
                setShowAllPhotos(false)
              }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 px-8 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Photos ({Object.values(collections).flat().length} photos)
            </button>
          </div>

          {/* Traditional Grid for "All Photos" */}
          {activeCategory === 'all' && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">All Our Memories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {(showAllPhotos ? filteredImages : filteredImages.slice(0, 5)).map((src, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
                    onClick={() => setSelectedImage(src)}
                  >
                    <img
                      src={src}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* View More/Less Button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="bg-white border-2 border-pink-500 text-pink-500 font-semibold py-3 px-6 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {showAllPhotos
                    ? `View Less (showing ${filteredImages.length} photos)`
                    : `View More (${filteredImages.length - 5} more photos)`
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="rsvp" className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-6 py-3 mb-6">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span className="text-pink-700 font-medium">Contact & Support</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Join Our Celebration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We can't wait to celebrate with you! Support our journey or find us on the map.
            </p>

            {/* Download Invitation Button */}
            <div className="flex justify-center">
              <button
                onClick={downloadInvitation}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Wedding Invitation</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Support Our Journey Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💕</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Support Our Journey</h3>
                <p className="text-gray-600">
                  Your love and support mean the world to us. Help us start our new chapter together.
                </p>
              </div>

              <div className="space-y-6">
                {/* Recipient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choose Recipient</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedRecipient('groom')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${selectedRecipient === 'groom'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">🤵</div>
                      <div className="font-medium text-gray-800">Groom</div>
                      <div className="text-sm text-gray-600">TUYIZERE Oreste</div>
                    </button>
                    <button
                      onClick={() => setSelectedRecipient('bride')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${selectedRecipient === 'bride'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👰</div>
                      <div className="font-medium text-gray-800">Bride</div>
                      <div className="text-sm text-gray-600">AKIMANA Nadine</div>
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Donation Amount (RWF)</label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-gray-700 bg-white"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[5000, 10000, 25000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount.toString())}
                        className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 text-center font-medium"
                      >
                        {amount.toLocaleString()} RWF
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate USSD Button */}
                <button
                  onClick={generateUSSD}
                  disabled={!selectedRecipient || !donationAmount}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Generate Donation Code
                </button>

                {/* USSD Code Display */}
                {ussdCode && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <h4 className="font-semibold text-green-800 mb-4">📱 Your Donation Code:</h4>
                    <div className="bg-white rounded-xl p-4 font-mono text-lg text-center border-2 border-green-300 mb-4">
                      {ussdCode}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={copyUSSDCode}
                        className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Code</span>
                      </button>
                      <button
                        onClick={dialUSSDCode}
                        className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Dial Now</span>
                      </button>
                    </div>

                    <p className="text-sm text-green-700 text-center">
                      This will initiate a mobile money transfer to {selectedRecipient === 'groom' ? 'TUYIZERE Oreste' : 'AKIMANA Nadine'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Map */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Find Us Here</h3>
                <p className="text-gray-600">
                  Join us at Alegria Inn - RUYENZI for our wedding celebration on December 13, 2025
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⛪</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Civil Wedding</h4>
                      <p className="text-sm text-gray-600">November 27, 2025</p>
                      <p className="text-sm text-gray-600">Nyarugenge District Headquarters</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🎉</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Wedding Celebration</h4>
                      <p className="text-sm text-gray-600">December 13, 2025</p>
                      <p className="text-sm text-gray-600">Alegria Inn - RUYENZI</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.454425401552!2d29.986389876787033!3d-1.9724072980097482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca57dbc789d19%3A0x79ad4f045ef68000!2sALEGRIA%20INN%20(RUYENZI)!5e0!3m2!1sen!2srw!4v1758729077064!5m2!1sen!2srw"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                ></iframe>
              </div>

              {/* Contact Info */}
              <div className="mt-6 bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">Need Help Finding Us?</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-pink-500">📍</span>
                    <span className="text-gray-600">Alegria Inn, RUYENZI</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-pink-500">🕒</span>
                    <span className="text-gray-600">December 13, 2025</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">With All Our Love</h3>
            <div className="flex items-center justify-center space-x-4 text-xl mb-2">
              <span className="text-pink-400">TUYIZERE Oreste</span>
              <span className="text-pink-300">&</span>
              <span className="text-rose-400">AKIMANA Nadine</span>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-gray-400">© 2025 Our Wedding Website • Made with Love</p>
            <p className="text-gray-500 text-sm">
              Website created by{' '}
              <a
                href="tel:+250780961542"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-300 underline hover:no-underline font-medium"
              >
                Wiron Ruzindana
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/75 transition-all duration-300 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative max-w-5xl w-full max-h-full">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-auto max-h-[80vh] rounded-2xl"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              >
                <source src={WeddingVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Close Button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/75 transition-all duration-300 text-xl border border-white/20"
              >
                ✕
              </button>

              {/* Video Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-2xl font-bold mb-2">Our Wedding Story</h3>
                <p className="text-white/80">TUYIZERE Oreste & AKIMANA Nadine</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      >
        ↑
      </button>
    </div>
  )
}

export default App