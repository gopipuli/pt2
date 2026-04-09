 import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'


const Hero = () => {

  const [pickupLocation, setPickupLocation] = useState('')

  const {pickupDate, setPickupDate, returnDate, setReturnDate, navigate} = useAppContext()

const handleSearch = (e)=>{
  e.preventDefault()
  navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate='+ pickupDate +'&returnDate=' + returnDate )
}

  return (
    <motion.div
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    transition={{duration: 0.8}}
    
    className='h-screen flex flex-col items-center justify-center gap-14
     bg-light text-center'>

      <motion.h1 
      initial={{y: 50, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.8, delay:0.2}}
      className='text-4xl md:text-5xl font-semibold'>Luxury cars on Rent</motion.h1>
      
      <motion.form 
       initial={{y: 50, opacity: 0, scale:0.95}}
       animate={{y: 0, opacity: 1, scale: 1}}
       transition={{duration: 0.6, delay:0.4}}
      onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center
      justify-start p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[800px]
      bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

        <div className='flex flex-col md:flex-row items-start md:items-center
        gap-6 flex-wrap md:ml-8 w-full'>
          
          {/* Pickup Location */}
          <div className='flex flex-col items-start gap-2'>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className='border px-2 py-1 rounded'
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option value={city} key={city}>{city}</option>
              ))}
            </select>

            <p className='px-1 text-sm text-gray-500'>
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>

          {/* Pickup Date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor='pickup-date'>Pickup Date</label>
            <input
            value={pickupDate}
            onChange={e=>setPickupDate(e.target.value)}
              type="date"
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
              className='text-sm text-gray-500 border px-2 py-1 rounded'
              required
            />
          </div>

          {/* Return Date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input
             value={returnDate}
            onChange={e=>setReturnDate(e.target.value)}
              type="date"
              id='return-date'
              className='text-sm text-gray-500 border px-2 py-1 rounded'
              required
            />
          </div>

          {/* Search Button */}
          <motion.button

            whileHover={{scale: 1.05}}
            whileTap={{scale:0.95}}
            type="submit"
            className='flex items-center justify-center gap-2 px-6 py-3
            max-sm:mt-4 md:ml-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full
            cursor-pointer whitespace-nowrap active:scale-95 transition bg-blue-500 rounded text-white shadow-lg shadow-blue-500/30 text-sm font-medium'>
            
            <img
              src={assets.search_icon}
              alt="search"
              className='w-4 h-4 brightness-0 invert'
            />
            Search
          </motion.button>

        </div>

      </motion.form>

      <motion.img 
      initial={{y:100, opacity:0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.8, delay: 0.6}}
      src={assets.main_car} alt="car" className='max-h-74' />
    </motion.div>
  )
}

export default Hero