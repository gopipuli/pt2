import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext' // adjust path

const Banner = () => {

  const navigate = useNavigate()
  const { token } = useContext(AppContext)

  const handleListCar = () => {
    if (!token) {
      navigate('/') // 🔴 not logged in
    } else {
      navigate('/owner/add-car') // 🟢 logged in
    }
  }

  return (
    <motion.div 
      initial={{opacity: 0,y: 50}}
      whileInView={{opacity: 1,y:  0}}
      transition={{duration: 0.6}}
      className='flex flex-col md:flex-row md:items-center items-center 
      justify-between px-6 md:px-12 lg:px-16 py-12 
      bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] 
      max-w-6xl mx-auto rounded-2xl overflow-hidden'>

      {/* Left Content */}
      <div className='text-white max-w-lg'>
        <h2 className='text-2xl md:text-3xl font-semibold'>
          Do You Own a Luxury Car ?
        </h2>

        <p className='mt-3 text-sm md:text-base'>
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>

        <p className='mt-2 text-sm md:text-base'>
          We take care of insurance, driver verification and secure payments
          so you can earn passive income, stress-free.
        </p>

        {/* ✅ Updated Button */}
        <motion.button 
          onClick={handleListCar}
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          className='mt-5 px-6 py-2 bg-white text-blue-600 rounded-lg 
          text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-100 
          transition-all duration-300'>
          List your car
        </motion.button>
      </div>

      {/* Right Image */}
      <motion.img 
        initial={{opacity:0, x: 50}}
        whileInView={{opacity: 1, x: 0}}
        transition={{duration: 0.6,  delay: 0.4}}
        src={assets.banner_car_image} 
        alt="car" 
        className='w-full md:w-[380px] lg:w-[450px] mt-8 md:mt-0'
      />

    </motion.div>
  )
}

export default Banner